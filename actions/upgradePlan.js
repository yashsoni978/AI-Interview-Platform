"use server";

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function upgradePlan(plan) {
  const user = await currentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const dbUser = await db.user.findUnique({
    where: {
      clerkUserId: user.id,
    },
  });

  if (!dbUser) {
    throw new Error("User not found");
  }

  // Only interviewees buy credits
  if (dbUser.role !== "INTERVIEWEE") {
  return {
    success: false,
    message: "Only interviewees can purchase credits",
  };
}

  const PLAN_ORDER = {
    free: 0,
    starter: 1,
    pro: 2,
  };

  if (PLAN_ORDER[plan] <= PLAN_ORDER[dbUser.currentPlan]) {
  return {
    success: false,
    message: "You can only upgrade to a higher plan",
  };
}

  const creditsToAdd = {
    starter: 5,
    pro: 15,
  }[plan];

  if (!creditsToAdd) {
  return {
    success: false,
    message: "Invalid plan",
  };
}

  await db.user.update({
    where: {
      clerkUserId: user.id,
    },
    data: {
      currentPlan: plan,
      credits: {
        increment: creditsToAdd,
      },
    },
  });

  revalidatePath("/", "layout");

  return {
    success: true,
  };
}
