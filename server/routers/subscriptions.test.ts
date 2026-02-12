import { describe, it, expect, beforeEach, vi } from "vitest";
import { subscriptionsRouter } from "./subscriptions";
import { getDb } from "../db";

// Mock the database
vi.mock("../db", () => ({
  getDb: vi.fn(),
}));

describe("subscriptionsRouter", () => {
  let mockDb: any;

  beforeEach(() => {
    mockDb = {
      select: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
    };
    vi.mocked(getDb).mockResolvedValue(mockDb);
  });

  describe("subscribe mutation", () => {
    it("should create a new subscription with valid email", async () => {
      const mockInsert = {
        values: vi.fn().mockResolvedValue(undefined),
      };
      mockDb.insert.mockReturnValue(mockInsert);
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      });

      const caller = subscriptionsRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.subscribe({
        email: "test@example.com",
        states: ["SP", "RJ"],
        cities: [],
        notificationType: "national",
        daysBeforeNotification: 7,
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain("sucesso");
      expect(result.isNew).toBe(true);
    });

    it("should reject invalid email", async () => {
      const caller = subscriptionsRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      try {
        await caller.subscribe({
          email: "invalid-email",
          states: [],
          cities: [],
          notificationType: "all",
          daysBeforeNotification: 7,
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.message).toContain("E-mail inválido");
      }
    });

    it("should update existing subscription", async () => {
      const mockUpdate = {
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue(undefined),
        }),
      };
      mockDb.update.mockReturnValue(mockUpdate);
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([
            {
              id: 1,
              email: "test@example.com",
              states: null,
              cities: null,
              notificationType: "all",
              daysBeforeNotification: 7,
              isActive: 1,
            },
          ]),
        }),
      });

      const caller = subscriptionsRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.subscribe({
        email: "test@example.com",
        states: ["MG"],
        cities: [],
        notificationType: "state",
        daysBeforeNotification: 14,
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain("atualizada");
      expect(result.isNew).toBe(false);
    });

    it("should validate daysBeforeNotification range", async () => {
      const caller = subscriptionsRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      try {
        await caller.subscribe({
          email: "test@example.com",
          states: [],
          cities: [],
          notificationType: "all",
          daysBeforeNotification: 0, // Invalid: less than 1
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.message).toBeDefined();
      }
    });

    it("should validate notificationType enum", async () => {
      const caller = subscriptionsRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      try {
        await caller.subscribe({
          email: "test@example.com",
          states: [],
          cities: [],
          notificationType: "invalid" as any,
          daysBeforeNotification: 7,
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.message).toBeDefined();
      }
    });
  });

  describe("unsubscribe mutation", () => {
    it("should unsubscribe a user", async () => {
      const mockUpdate = {
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue(undefined),
        }),
      };
      mockDb.update.mockReturnValue(mockUpdate);

      const caller = subscriptionsRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.unsubscribe({
        email: "test@example.com",
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain("cancelada");
    });
  });

  describe("checkStatus query", () => {
    it("should return subscription status for existing user", async () => {
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([
            {
              id: 1,
              email: "test@example.com",
              states: JSON.stringify(["SP", "RJ"]),
              cities: JSON.stringify(["São Paulo"]),
              notificationType: "all",
              daysBeforeNotification: 7,
              isActive: 1,
            },
          ]),
        }),
      });

      const caller = subscriptionsRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.checkStatus({
        email: "test@example.com",
      });

      expect(result.isSubscribed).toBe(true);
      expect(result.subscription).toBeDefined();
      expect(result.subscription?.states).toEqual(["SP", "RJ"]);
      expect(result.subscription?.cities).toEqual(["São Paulo"]);
    });

    it("should return not subscribed for non-existing user", async () => {
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      });

      const caller = subscriptionsRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.checkStatus({
        email: "nonexistent@example.com",
      });

      expect(result.isSubscribed).toBe(false);
      expect(result.subscription).toBeNull();
    });
  });

  describe("logNotification mutation", () => {
    it("should log a notification", async () => {
      const mockInsert = {
        values: vi.fn().mockResolvedValue(undefined),
      };
      mockDb.insert.mockReturnValue(mockInsert);

      const caller = subscriptionsRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.logNotification({
        subscriptionId: 1,
        holidayDate: "2026-12-25",
        holidayName: "Natal",
        status: "sent",
      });

      expect(result.success).toBe(true);
    });
  });
});
