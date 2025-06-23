import type { Route } from "./+types/login-page";
import InputPair from "~/common/components/input-pair";
import { Form, Link, redirect } from "react-router";
import { LoadingButton } from "~/common/components/loading-button";
import { z } from "zod";
import { makeSSRClient } from "~/supa-client";
import { AuthButtons } from "../conponentes/auth-buttons";

const formSchema = z.object({
  email: z.string({
      required_error: "Email is required",
      invalid_type_error: "Email should be a string",
  }).email("Invalid email address"),
  password: z.string({
      required_error: "Password is required",
  }).min(8, { message: "Password must be at least 8 characters long" }),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const { success, data, error } = formSchema.safeParse(Object.fromEntries(formData));
  if (!success) {
    return {
      loginError: null,
      formError: error.flatten().fieldErrors,
    };
  }
  const { email, password } = data;
  const { client, headers } = makeSSRClient(request);
  const { error: loginError } = await client.auth.signInWithPassword({
      email,
      password,
    });
    if (loginError) {
      return {
        loginError: loginError.message,
        formError: null,
      };
    }
  return redirect("/room", { headers });
};

export default function LoginPage({ actionData }: Route.ComponentProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 text-center">로그인</h2>
      <Form className="w-full space-y-4" method="post">
        <InputPair
            id="email"
            label="Email"
            name="email"
            required
            type="email"
            placeholder="이메일 주소를 입력해주세요"
        />
        {actionData && "formError" in actionData && (
            <p className="text-sm text-red-500">{actionData.formError?.email?.join(", ")}</p>
        )}
        <InputPair
            id="password"
            label="Password"
            name="password"
            required
            type="password"
            placeholder="비밀번호를 입력해주세요"
        />
        {actionData && "formError" in actionData && (
            <p className="text-sm text-red-500">{actionData.formError?.password?.join(", ")}</p>
        )}                    
        <LoadingButton text="로그인" />
        {actionData && "loginError" in actionData && (
            <p className="text-sm text-red-500">{actionData.loginError}</p>
        )}                    
    </Form>

      {/* <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
            로그인 상태 유지
          </label>
        </div>

        <div className="text-sm">
          <Link to="/auth/find-password/start" className="font-medium text-indigo-600 hover:text-indigo-500">
            비밀번호를 잊으셨나요?
          </Link>
        </div>
      </div> */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or Continue With</span>
          </div>
        </div>
        <AuthButtons />
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          아직 가입 전이라면?{' '}
          <Link to="/auth/join" className="font-medium text-indigo-600 hover:text-indigo-500">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
