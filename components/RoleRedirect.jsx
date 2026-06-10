"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const INTERVIEWER_ONLY = ["/appointments"];
const INTERVIEWEE_ONLY = ["/dashboard"];

export default function RoleRedirect({ role }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const PUBLIC_ROUTES = ["/", "/pricing"];

    if (
      role === "UNASSIGNED" &&
      !PUBLIC_ROUTES.includes(pathname) &&
      pathname !== "/onboarding"
    ) {
      router.replace("/onboarding");
    }

    if (role === "INTERVIEWER" && pathname.startsWith("/onboarding"))
      router.replace("/dashboard");

    if (role === "INTERVIEWEE" && pathname.startsWith("/onboarding"))
      router.replace("/explore");

    if (
      role === "INTERVIEWER" &&
      INTERVIEWER_ONLY.some((p) => pathname.startsWith(p))
    )
      router.replace("/dashboard");

    if (
      role === "INTERVIEWEE" &&
      INTERVIEWEE_ONLY.some((p) => pathname.startsWith(p))
    )
      router.replace("/appointments");
  }, [role, pathname, router]);

  return null;
}
