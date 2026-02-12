import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { emailSubscriptions, notificationLogs } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

const subscriptionSchema = z.object({
  email: z.string().email("E-mail inválido"),
  states: z.array(z.string()).optional().default([]),
  cities: z.array(z.string()).optional().default([]),
  notificationType: z
    .enum(["all", "national", "state", "municipal", "judiciary"])
    .default("all"),
  daysBeforeNotification: z.number().int().min(1).max(30).default(7),
});

export const subscriptionsRouter = router({
  // Subscribe to holiday notifications
  subscribe: publicProcedure
    .input(subscriptionSchema)
    .mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // Check if email already exists
        const existing = await db
          .select()
          .from(emailSubscriptions)
          .where(eq(emailSubscriptions.email, input.email));

        if (existing.length > 0) {
          // Update existing subscription
          await db
            .update(emailSubscriptions)
            .set({
              states: input.states.length > 0 ? JSON.stringify(input.states) : null,
              cities: input.cities.length > 0 ? JSON.stringify(input.cities) : null,
              notificationType: input.notificationType,
              daysBeforeNotification: input.daysBeforeNotification,
              isActive: 1,
              updatedAt: new Date(),
            })
            .where(eq(emailSubscriptions.email, input.email));

          return {
            success: true,
            message: "Inscrição atualizada com sucesso!",
            isNew: false,
          };
        }

        // Create new subscription
        await db.insert(emailSubscriptions).values({
          email: input.email,
          states: input.states.length > 0 ? JSON.stringify(input.states) : null,
          cities: input.cities.length > 0 ? JSON.stringify(input.cities) : null,
          notificationType: input.notificationType,
          daysBeforeNotification: input.daysBeforeNotification,
          isActive: 1,
        });

        return {
          success: true,
          message: "Inscrição realizada com sucesso!",
          isNew: true,
        };
      } catch (error) {
        console.error("Subscription error:", error);
        throw new Error("Erro ao processar inscrição");
      }
    }),

  // Unsubscribe from notifications
  unsubscribe: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        await db
          .update(emailSubscriptions)
          .set({ isActive: 0 })
          .where(eq(emailSubscriptions.email, input.email));

        return {
          success: true,
          message: "Inscrição cancelada com sucesso!",
        };
      } catch (error) {
        console.error("Unsubscribe error:", error);
        throw new Error("Erro ao cancelar inscrição");
      }
    }),

  // Check subscription status
  checkStatus: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const subscription = await db
          .select()
          .from(emailSubscriptions)
          .where(eq(emailSubscriptions.email, input.email));

        if (subscription.length === 0) {
          return {
            isSubscribed: false,
            subscription: null,
          };
        }

        const sub: typeof emailSubscriptions.$inferSelect = subscription[0];
        return {
          isSubscribed: sub.isActive === 1,
          subscription: {
            email: sub.email,
            states: sub.states ? JSON.parse(sub.states) : [],
            cities: sub.cities ? JSON.parse(sub.cities) : [],
            notificationType: sub.notificationType,
            daysBeforeNotification: sub.daysBeforeNotification,
          },
        };
      } catch (error) {
        console.error("Check status error:", error);
        throw new Error("Erro ao verificar status");
      }
    }),

  // Get all active subscriptions (for admin/scheduler)
  getActive: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const subscriptions = await db
        .select()
        .from(emailSubscriptions)
        .where(eq(emailSubscriptions.isActive, 1));

      return subscriptions.map((sub) => ({
        ...sub,
        states: sub.states ? JSON.parse(sub.states) : [],
        cities: sub.cities ? JSON.parse(sub.cities) : [],
      }));
    } catch (error) {
      console.error("Get active subscriptions error:", error);
      throw new Error("Erro ao buscar inscrições");
    }
  }),

  // Log notification sent
  logNotification: publicProcedure
    .input(
      z.object({
        subscriptionId: z.number(),
        holidayDate: z.string(),
        holidayName: z.string(),
        status: z.enum(["sent", "failed", "bounced"]).default("sent"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        await db.insert(notificationLogs).values({
          subscriptionId: input.subscriptionId,
          holidayDate: input.holidayDate,
          holidayName: input.holidayName,
          status: input.status,
        });

        return { success: true };
      } catch (error) {
        console.error("Log notification error:", error);
        throw new Error("Erro ao registrar notificação");
      }
    }),
});
