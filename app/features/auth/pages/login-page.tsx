import type { Route } from "./+types/login-page";
import InputPair from "~/common/components/input-pair";
import { Form, Link, redirect } from "react-router";
import LoadingButton from "~/common/components/loading-button";
import { z } from "zod";
import { makeSSRClient } from "~/supa-client";
import { getLoggedInUserId } from "~/features/users/queries";
import { AuthButtons } from "../conponentes/auth-buttons";
import { Alert, AlertDescription, AlertTitle } from "~/common/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

const formSchema = z.object({
  email: z.string({
      required_error: "이메일을 입력해주세요",
      invalid_type_error: "이메일은 문자열이어야 합니다",
  }).email("이메일 형식이 올바르지 않습니다"),
  password: z.string({
      required_error: "비밀번호를 입력해주세요",
  }).min(8, { message: "비밀번호는 8자 이상이어야 합니다" }),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const { success, data, error } = formSchema.safeParse(Object.fromEntries(formData));
  if (!success) {
    console.log("석세스 에러", error.flatten().fieldErrors);
    return {
      loginError: null,
      formErrors: error.flatten().fieldErrors,
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
        formErrors: null,
      };
    }
  const userId = await getLoggedInUserId(client);
  await client.from("profiles").update({
    is_active: true,
    last_active_at: new Date().toISOString(),
  }).eq("profile_id", userId);
  
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
        {actionData?.formErrors && "email" in actionData?.formErrors ? (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertDescription>
                {actionData.formErrors?.email}
              </AlertDescription>
            </Alert>
        ) : null}
        <InputPair
            id="password"
            label="Password"
            name="password"
            required
            type="password"
            placeholder="비밀번호를 입력해주세요"
        />
        {actionData?.formErrors && "password" in actionData?.formErrors ? (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertDescription>
                {actionData.formErrors?.password}
              </AlertDescription>
            </Alert>
        ) : null}                    
        <LoadingButton text="로그인" />
        {actionData?.loginError ? (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertTitle>{actionData.loginError}</AlertTitle>
              <AlertDescription className="text-xs">
                입력하신 정보를 다시 확인해주세요
              </AlertDescription>
            </Alert>
        ) : null}                    
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
