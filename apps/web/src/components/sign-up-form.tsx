import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";
import {
	ArrowRight,
	Eye,
	EyeOff,
	LoaderCircle,
	Lock,
	User,
	UserPlus,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";

import { toAccountEmail, usernameSchema } from "@/lib/account";
import { authClient } from "@/lib/auth-client";
import { getAuthErrorMessage } from "@/lib/auth-error";

import Loader from "./loader";

const MIN_PASSWORD_LENGTH = 6;

export default function SignUpForm() {
	const navigate = useNavigate({ from: "/register" });
	const { isPending } = authClient.useSession();
	const [showPassword, setShowPassword] = useState(false);

	const form = useForm({
		defaultValues: {
			username: "",
			password: "",
		},
		onSubmit: async ({ value }) => {
			await authClient.signUp.email(
				{
					email: toAccountEmail(value.username),
					password: value.password,
					name: value.username,
				},
				{
					onSuccess: () => {
						navigate({ to: "/" });
						toast.success("注册成功");
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
				<div className="absolute -top-[20%] -right-[10%] h-[60%] w-[60%] rounded-full bg-primary/10 blur-[120px]" />
				<div className="absolute top-[40%] -left-[10%] h-[50%] w-[50%] rounded-full bg-secondary/5 blur-[100px]" />
			</div>

			<main className="z-10 flex w-full max-w-md flex-col space-y-8">
				<div className="relative mx-auto flex size-32 items-center justify-center">
					<div className="absolute inset-0 rounded-full border border-primary/20" />
					<div className="absolute inset-4 rounded-full border border-primary/10" />
					<div className="absolute inset-0 animate-radar-scan">
						<div className="h-full w-1/2 origin-right rounded-l-full bg-gradient-to-t from-primary/30 to-transparent" />
					</div>
					<UserPlus className="relative z-10 size-10 text-primary" />
				</div>

				<h1 className="text-center font-bold text-[32px] text-on-surface tracking-tight">
					注册
				</h1>

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
							<div className="space-y-2">
								<label
									className="ml-1 font-label text-on-surface-variant text-xs uppercase tracking-[0.1em]"
									htmlFor={field.name}
								>
									账号
								</label>
								<div className="group relative">
									<User className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-primary" />
									<input
										className="h-14 w-full rounded-xl border border-white/5 bg-surface-container pr-4 pl-12 text-on-surface outline-none transition-all placeholder:text-on-surface-variant/40 focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
										id={field.name}
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(event) => field.handleChange(event.target.value)}
										placeholder="请输入要注册的账号"
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
							<div className="space-y-2">
								<label
									className="ml-1 font-label text-on-surface-variant text-xs uppercase tracking-[0.1em]"
									htmlFor={field.name}
								>
									密码
								</label>
								<div className="group relative">
									<Lock className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-on-surface-variant transition-colors group-focus-within:text-primary" />
									<input
										className="h-14 w-full rounded-xl border border-white/5 bg-surface-container pr-12 pl-12 text-on-surface outline-none transition-all placeholder:text-on-surface-variant/40 focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
										id={field.name}
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(event) => field.handleChange(event.target.value)}
										placeholder="••••••••"
										type={showPassword ? "text" : "password"}
										value={field.state.value}
									/>
									<button
										aria-label={showPassword ? "隐藏密码" : "显示密码"}
										className="absolute top-1/2 right-4 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
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
									className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-lg text-primary-foreground transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
									disabled={!canSubmit || isSubmitting}
									type="submit"
								>
									{isSubmitting ? (
										<LoaderCircle className="size-6 animate-spin" />
									) : (
										<>
											<span>注册</span>
											<ArrowRight className="size-5" />
										</>
									)}
								</button>
							)}
						</form.Subscribe>
					</div>
				</form>

				<div className="pt-4 text-center">
					<Link
						className="inline-flex items-center gap-1 text-on-surface-variant transition-colors hover:text-primary"
						to="/login"
					>
						<span>已有账号？</span>
						<span className="font-semibold text-primary">返回登录</span>
					</Link>
				</div>

				<p className="px-8 text-center font-label text-[10px] text-on-surface-variant/40 uppercase tracking-[0.1em]">
					点击注册即表示您同意我们的服务条款和隐私政策
				</p>
			</main>
		</div>
	);
}
