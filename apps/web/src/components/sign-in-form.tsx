import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, LoaderCircle, Lock, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";

import { RadarLogo } from "@/components/radar-logo";
import { toAccountEmail, usernameSchema } from "@/lib/account";
import { authClient } from "@/lib/auth-client";
import { getAuthErrorMessage } from "@/lib/auth-error";

import Loader from "./loader";

const MIN_PASSWORD_LENGTH = 6;

export default function SignInForm() {
	const navigate = useNavigate({ from: "/login" });
	const { isPending } = authClient.useSession();
	const [showPassword, setShowPassword] = useState(false);

	const form = useForm({
		defaultValues: {
			username: "",
			password: "",
		},
		onSubmit: async ({ value }) => {
			await authClient.signIn.email(
				{
					email: toAccountEmail(value.username),
					password: value.password,
				},
				{
					onSuccess: () => {
						navigate({ to: "/" });
						toast.success("登录成功");
					},
					onError: (error) => {
						toast.error(getAuthErrorMessage(error.error));
					},
				}
			);
		},
		validators: {
			onSubmit: z.object({
				username: usernameSchema,
				password: z
					.string()
					.min(MIN_PASSWORD_LENGTH, `密码至少 ${MIN_PASSWORD_LENGTH} 位`),
			}),
		},
	});

	if (isPending) {
		return <Loader />;
	}

	return (
		<div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-background px-5 py-12">
			<div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
				<div className="absolute -top-[20%] -left-[10%] h-[60%] w-[60%] rounded-full bg-primary/10 blur-[120px]" />
				<div className="absolute top-[40%] -right-[10%] h-[50%] w-[50%] rounded-full bg-secondary/5 blur-[100px]" />
			</div>

			<main className="z-10 flex w-full flex-col items-center">
				<div className="mb-10">
					<RadarLogo />
				</div>

				<div className="w-full max-w-sm">
					<div className="mb-8 text-center">
						<h2 className="mb-2 font-semibold text-2xl text-on-surface">
							欢迎回来
						</h2>
						<p className="text-on-surface-variant">洞察驱动的痛点管理</p>
					</div>

					<form
						className="space-y-4"
						onSubmit={(event) => {
							event.preventDefault();
							event.stopPropagation();
							form.handleSubmit();
						}}
					>
						<form.Field name="username">
							{(field) => (
								<div className="space-y-1">
									<label
										className="ml-1 font-label text-on-surface-variant text-xs uppercase tracking-[0.1em]"
										htmlFor={field.name}
									>
										账号
									</label>
									<div className="group relative">
										<div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4">
											<User className="size-5 text-primary" />
										</div>
										<input
											className="glass-card w-full rounded-xl py-4 pr-4 pl-12 text-on-surface transition-all placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary"
											id={field.name}
											name={field.name}
											onBlur={field.handleBlur}
											onChange={(event) =>
												field.handleChange(event.target.value)
											}
											placeholder="账号"
											type="text"
											value={field.state.value}
										/>
									</div>
									{field.state.meta.errors.map((error) => (
										<p className="ml-1 text-error text-sm" key={error?.message}>
											{error?.message}
										</p>
									))}
								</div>
							)}
						</form.Field>

						<form.Field name="password">
							{(field) => (
								<div className="space-y-1">
									<label
										className="ml-1 font-label text-on-surface-variant text-xs uppercase tracking-[0.1em]"
										htmlFor={field.name}
									>
										密码
									</label>
									<div className="group relative">
										<div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4">
											<Lock className="size-5 text-primary" />
										</div>
										<input
											className="glass-card w-full rounded-xl py-4 pr-12 pl-12 text-on-surface transition-all placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary"
											id={field.name}
											name={field.name}
											onBlur={field.handleBlur}
											onChange={(event) =>
												field.handleChange(event.target.value)
											}
											placeholder="••••••••"
											type={showPassword ? "text" : "password"}
											value={field.state.value}
										/>
										<div className="absolute inset-y-0 right-0 z-10 flex items-center pr-4">
											<button
												aria-label={showPassword ? "隐藏密码" : "显示密码"}
												className="text-on-surface-variant transition-colors hover:text-on-surface"
												onClick={() => setShowPassword((prev) => !prev)}
												type="button"
											>
												{showPassword ? (
													<EyeOff className="size-5" />
												) : (
													<Eye className="size-5" />
												)}
											</button>
										</div>
									</div>
									{field.state.meta.errors.map((error) => (
										<p className="ml-1 text-error text-sm" key={error?.message}>
											{error?.message}
										</p>
									))}
								</div>
							)}
						</form.Field>

						<div className="pt-4">
							<form.Subscribe
								selector={(state) => ({
									canSubmit: state.canSubmit,
									isSubmitting: state.isSubmitting,
								})}
							>
								{({ canSubmit, isSubmitting }) => (
									<button
										className="flex w-full items-center justify-center rounded-xl bg-primary py-4 font-semibold text-lg text-primary-foreground shadow-[0_0_15px_rgba(184,195,255,0.15)] transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
										disabled={!canSubmit || isSubmitting}
										type="submit"
									>
										{isSubmitting ? (
											<LoaderCircle className="size-6 animate-spin" />
										) : (
											"登录"
										)}
									</button>
								)}
							</form.Subscribe>
						</div>
					</form>
				</div>

				<footer className="mt-auto pt-8">
					<p className="text-on-surface-variant">
						还没有账号？
						<Link
							className="font-semibold text-primary hover:underline"
							to="/register"
						>
							立即注册
						</Link>
					</p>
				</footer>
			</main>
		</div>
	);
}
