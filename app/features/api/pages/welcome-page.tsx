// import type { Route } from "./+types/welcome-page"
// import { Resend } from "resend";
// import { WelcomeUser } from "react-email-starter/emails/welcome-user"

// const client = new Resend(process.env.RESEND_API_KEY);

// // cron job처럼 보호해야됨
// export const loader = async ({ params }: Route.LoaderArgs) => {
//     const { data, error } = await client.emails.send({
//         from: "<email>",
//         to: ["to email"],
//         subject: "subject",
//         react: <WelcomeUser username={'username'} />,
//     });
//     return Response.json({ data, error });
// };