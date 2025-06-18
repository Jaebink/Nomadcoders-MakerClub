import { Outlet } from "react-router";
import { Button } from "~/common/components/ui/button";
import { Link } from "react-router"

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg py-8 px-10">
          <Button variant="outline" asChild className="absolute top-8 right-8">
              <Link to="/" >돌아가기</Link>
          </Button>
          <Outlet />
        </div>
    </div>
  );
}
