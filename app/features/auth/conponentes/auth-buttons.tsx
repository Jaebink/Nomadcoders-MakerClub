import { GithubIcon, MessageCircleIcon } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/common/components/ui/button";

export function AuthButtons() {
    return (
        <div className="mt-6 grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full" asChild>
                <Link to="/auth/social/kakao/start">
                    <MessageCircleIcon className="w-4 h-4" />
                    Kakao Talk
                </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
                <Link to="/auth/social/github/start">
                    <GithubIcon className="w-4 h-4" />
                    Github
                </Link>
            </Button>
        </div>
    );
}