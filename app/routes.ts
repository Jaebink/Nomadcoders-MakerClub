import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
    index("common/pages/home-page.tsx"),
    ...prefix("auth", [
		layout("features/auth/layouts/auth-layout.tsx", [
			route("/login", "features/auth/pages/login-page.tsx"),
			route("/join", "features/auth/pages/join-page.tsx"),
			...prefix("otp", [
				route("/start", "features/auth/pages/otp-start-page.tsx"),
				route("/complete", "features/auth/pages/otp-complete-page.tsx"),
			]),
			...prefix("social/:provider", [
				route("/start", "features/auth/pages/social-start-page.tsx"),
				route("/complete", "features/auth/pages/social-complete-page.tsx"),
			]),
		]),
		route("/logout", "features/auth/pages/logout-page.tsx"),
	]),
] satisfies RouteConfig;