import prisma from "@pain-radar/db";
import z from "zod";

import { protectedProcedure, router } from "../index";

const painPointTextSchema = z.string().trim().min(1).max(2000);
const painPointSearchSchema = z.string().trim().max(100).optional();

export const painPointRouter = router({
	create: protectedProcedure
		.input(z.object({ text: painPointTextSchema }))
		.mutation(
			async ({ ctx, input }) =>
				await prisma.painPoint.create({
					data: {
						text: input.text,
						userId: ctx.session.user.id,
					},
				})
		),

	list: protectedProcedure
		.input(z.object({ search: painPointSearchSchema }))
		.query(async ({ ctx, input }) => {
			const search = input.search;

			return await prisma.painPoint.findMany({
				where: {
					userId: ctx.session.user.id,
					...(search
						? { text: { contains: search, mode: "insensitive" as const } }
						: {}),
				},
				orderBy: { createdAt: "desc" },
			});
		}),

	count: protectedProcedure.query(
		async ({ ctx }) =>
			await prisma.painPoint.count({
				where: { userId: ctx.session.user.id },
			})
	),
});
