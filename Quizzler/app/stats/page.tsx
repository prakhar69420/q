import { auth } from "@clerk/nextjs/server";
import React from "react";
import prisma from "@/utils/connect";
import UserStats from "@/components/UserStats";

async function page() {
  const { userId } = await auth();

  // If the user isn't logged in, return a message inside a div
  if (!userId) {
    return <div>You need to be logged in to view this page</div>;
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
    include: {
      categoryStats: {
        include: {
          category: true, // populate the category
        },
      },
    },
  });

  // It's also good practice to handle the case where the user is not in the database
  if (!user) {
    return <div>User not found in our database.</div>;
  }

  console.log("User stats:", user);

  return (
    <div>
      <UserStats userStats={user} />
    </div>
  );
}

export default page;
