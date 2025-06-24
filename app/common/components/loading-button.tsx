import { Button } from "~/common/components/ui/button";
import { Link, useNavigation } from "react-router";
import { LoaderCircle } from "lucide-react";

// 기본 props를 먼저 정의합니다.
interface BaseLoadingButtonProps {
    className?: string;
    text: string;
    // to는 여기서는 정의하지 않습니다. 각 union 멤버에서 정의합니다.
}

// 1. type이 "link"일 때의 Props (to가 필수)
interface LoadingButtonLinkProps extends BaseLoadingButtonProps {
    type: "link"; // type이 반드시 "link"여야 함
    to: string; // "link" 타입일 때는 to가 반드시 string이어야 함
}

// 2. type이 "button" | "submit" | "reset"일 때의 Props (to가 없어야 함)
interface LoadingButtonActionProps extends BaseLoadingButtonProps {
    type?: "button" | "submit" | "reset"; // type이 link가 아닐 때 (기본값 "submit")
    to?: undefined;
    // 'to' 속성은 이 인터페이스에서 제거되거나, 명시적으로 undefined로 설정됩니다.
    // 여기서는 type이 "link"가 아닐 때는 to가 없어야 하므로, 아예 정의하지 않습니다.
    // TypeScript가 Discriminated Union을 통해 to의 존재 여부를 추론할 수 있도록 합니다.
}

// 3. 두 인터페이스를 합친 Discriminated Union 타입
// 이렇게 정의하면, type의 값에 따라 to의 존재 여부가 명확히 구분됩니다.
type LoadingButtonProps = LoadingButtonLinkProps | LoadingButtonActionProps;

export default function LoadingButton({ className, text, type = "submit", ...rest }: LoadingButtonProps) {
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting" || navigation.state === "loading";
        if (type === "link") {
            const { to } = rest as LoadingButtonLinkProps; // 명시적으로 `to`를 가져오고 타입 단언

        return (
            <Button variant="secondary" asChild className={`w-full ${className}`} disabled={isSubmitting}>
                <Link to={"/auth/join"}>
                    {isSubmitting ? (<LoaderCircle className="w-4 h-4 animate-spin" />) : (text)}
                </Link>
            </Button>
        );
    } else {
        // type이 "link"가 아닌 경우
        // 'rest' 객체에는 'to' 속성이 없다고 TypeScript가 추론합니다.
        return (
            <Button variant="secondary" type={type} className={`w-full ${className}`} disabled={isSubmitting}>
                {isSubmitting ? (<LoaderCircle className="w-4 h-4 animate-spin" />) : (text)}
            </Button>
        );
    }
}