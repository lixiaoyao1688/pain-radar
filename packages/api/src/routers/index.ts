import { protectedProcedure, publicProcedure, router } from "../index";
import { painPointRouter } from "./pain-point";
import { todoRouter } from "./todo";

export const appRouter = router({
	healthCheck: publicProcedure.query(() => "OK"),
	privateData: protectedProcedure.query(({ ctx }) => ({
		message: "This is private",
		user: ctx.session.user,
	})),
	painPoint: painPointRouter,
	todo: todoRouter,
});
export type AppRouter = typeof appRouter;
