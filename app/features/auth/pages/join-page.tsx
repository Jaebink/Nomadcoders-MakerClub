import type { Route } from "./+types/join-page";
import { makeSSRClient } from "~/supa-client";
import { Form, Link, redirect } from "react-router";
import { z } from "zod";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { AuthButtons } from "../conponentes/auth-buttons";
import LoadingButton from "~/common/components/loading-button";
import InputPair from "~/common/components/input-pair";

const formSchema = z.object({
  email: z.string({
    required_error: "이메일을 입력해주세요",
    invalid_type_error: "이메일은 문자열이어야 합니다",
  }).email("Invalid email address"),
  password: z.string({
    required_error: "비밀번호를 입력해주세요",
  }).min(8, { message: "비밀번호는 8자 이상이어야 합니다" }),
  confirmPassword: z.string({
    required_error: "비밀번호를 확인해주세요",
  }).min(8, { message: "비밀번호는 8자 이상이어야 합니다" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "비밀번호가 일치하지 않습니다",
});

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const { success, data, error } = formSchema.safeParse(Object.fromEntries(formData));
  if (!success) {
      return {
          formError: error.flatten().fieldErrors,
      };
  }
  // const usernameExists = await checkUsernameExists(request, { username: data.username });
  // if (usernameExists) {
  //     return {
  //         formError: {
  //             username: ["Username already exists"],
  //         },
  //     };
  // }
  const { client, headers } = makeSSRClient(request);
  const { error: signUpError } = await client.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
          data: {
              name: 'anonymous',
              username: 'mr.' + Math.random().toString(36).substring(2, 15),
          },
      },
  });
  if (signUpError) {
      console.error('SignUp Error:', {
          message: signUpError.message,
          name: signUpError.name,
          // status: signUpError.status,
          // details: signUpError.details,
          data: data  // 실제 전송된 데이터 확인
      });
      return {
          signUpError: `${signUpError.message} (${signUpError.name})`,
      };
  }
  return redirect("/room", { headers });
};

export default function JoinPage() {
  const [showPassword, setShowPassword] = useState(false);

  const [password, setPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword); // 비밀번호 상태 업데이트

    // 8자 이상일 때만 비밀번호 확인 필드를 보이도록 상태 업데이트
    setShowConfirmPassword(newPassword.length >= 8);
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 text-center">고민 해결사로 함께해요</h2>
      <p className="mt-2 text-sm text-gray-600 text-center">
        혼자 고민하지 마세요. 해결사들이 기다리고 있어요
      </p>
      <Form method="post" className="space-y-4">
        <div className="space-y-4">
          <InputPair
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="이메일 주소를 입력해주세요"
            required
          />
          <div>
            <InputPair
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              label="Password"
              placeholder="비밀번호를 입력해주세요 (8자 이상)"
              className="relative"
              required
              value={password}
              onChange={handlePasswordChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
            <InputPair
              id="confirm-password"
              name="confirm-password"
              type="password"
              placeholder="비밀번호 확인"
              className={`transition-all duration-500 ease-in-out ${showConfirmPassword ? "max-h-40 opacity-100" : "max-h-0 opacity-0 translate-y-[-10px]"}`}
              required
            />
          </div>
        </div>

        {/* <div className="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
            <Link to="/terms" className="text-indigo-600 hover:text-indigo-500">
              이용약관
            </Link>과{' '}
            <Link to="/privacy" className="text-indigo-600 hover:text-indigo-500">
              개인정보 처리방침
            </Link>에 동의합니다.
          </label>
        </div> */}
        <LoadingButton text="회원가입" />
      </Form>
      
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
          이미 고민 해결사이신가요?
          <Link to="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500 ml-2 ">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
