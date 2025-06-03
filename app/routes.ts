import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
    index("common/pages/home-page.tsx"),
	route("/room", "features/room/pages/room-page.tsx"),
	layout("features/channels/layouts/channel-layout.tsx", [
		...prefix("channels", [
			index("features/channels/pages/channels-page.tsx"),
			route("/:channelId", "features/channels/pages/channel-page.tsx"),
		]),
	]),
    ...prefix("auth", [
		layout("features/auth/layouts/auth-layout.tsx", [
			route("/login", "features/auth/pages/login-page.tsx"),
			route("/join", "features/auth/pages/join-page.tsx"),
			...prefix("find-password", [
				route("/start", "features/auth/pages/find-password-start-page.tsx"),
				route("/complete", "features/auth/pages/find-password-complete-page.tsx"),
			]),
			...prefix("social/:provider", [
				route("/start", "features/auth/pages/social-start-page.tsx"),
				route("/complete", "features/auth/pages/social-complete-page.tsx"),
			]),
		]),
		route("/logout", "features/auth/pages/logout-page.tsx"),
	]),
] satisfies RouteConfig;