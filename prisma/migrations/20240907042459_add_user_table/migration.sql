-- CreateTable
CREATE TABLE "users" (
    "user_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone_number" VARCHAR(15) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);
