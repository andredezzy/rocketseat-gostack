# Migration `20200721231532-add-available-field-to-signal-model`

This migration has been generated by André 'Dezzy' at 7/21/2020, 11:15:32 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."signals" ADD COLUMN "availableFor" "Role"[]  ;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200717072748-alter-referral-id-field-set-unique..20200721231532-add-available-field-to-signal-model
--- datamodel.dml
+++ datamodel.dml
@@ -1,138 +1,139 @@
-// This is your Prisma schema file,
-// learn more about it in the docs: https://pris.ly/d/prisma-schema
-
-datasource db {
-  provider = "postgresql"
-  url = "***"
-}
-
-generator client {
-  provider = "prisma-client-js"
-}
-
-model User {
-  @@map("users")
-
-  id                         String                    @id @default(uuid())
-  name                       String
-  email                      String                    @unique
-  username                   String                    @unique
-  password                   String
-  profile                    Profile
-  recovery_password_requests RecoveryPasswordRequest[]
-
-  referrals Profile[] @relation("Profile_referral")
-
-  created_at DateTime @default(now())
-  updated_at DateTime @default(now())
-}
-
-model Profile {
-  @@map("profiles")
-
-  id               String                @id @default(uuid())
-  user             User                  @relation(fields: [user_id], references: [id])
-  referral_id      String                @unique
-  user_id          String
-  referral         User?                 @relation("Profile_referral", fields: [referral_user_id], references: [id])
-  referral_user_id String?
-  roles            Role[]
-  statistics       Statistics
-  subscriptions    PagarMeSubscription[]
-
-  created_at DateTime @default(now())
-  updated_at DateTime @default(now())
-}
-
-model Statistics {
-  @@map("statistics")
-
-  id         String   @id @default(uuid())
-  profile    Profile  @relation(fields: [profile_id], references: [id])
-  profile_id String
-  wins       Signal[] @relation("Signal_won_by", references: [id])
-  losses     Signal[] @relation("Signal_lost_by", references: [id])
-
-  created_at DateTime @default(now())
-  updated_at DateTime @default(now())
-}
-
-model Signal {
-  @@map("signals")
-
-  id         String     @id @default(uuid())
-  currency   String
-  date       DateTime
-  operation  Operation
-  expiration Expiration
-  result     Result?
-  gales      Int        @default(0)
-
-  won_by  Statistics[] @relation("Signal_won_by", references: [id])
-  lost_by Statistics[] @relation("Signal_lost_by", references: [id])
-
-  created_at DateTime @default(now())
-  updated_at DateTime @default(now())
-}
-
-model RecoveryPasswordRequest {
-  @@map("recovery_password_requests")
-
-  id        String  @id @default(uuid())
-  user      User    @relation(fields: [user_id], references: [id])
-  user_id   String
-  token     String  @unique
-  recovered Boolean @default(false)
-
-  created_at DateTime @default(now())
-  updated_at DateTime @default(now())
-}
-
-model PagarMeSubscription {
-  @@map("subscriptions")
-
-  id                String   @id @default(uuid())
-  profile           Profile? @relation(fields: [profile_id], references: [id])
-  profile_id        String?
-  subscription_id   Int
-  email             String
-  status            Status
-  checkout_json     String
-  subscription_json String
-  postbacks_json    String[]
-
-  created_at DateTime @default(now())
-  updated_at DateTime @default(now())
-}
-
-enum Role {
-  ADMIN
-  MANAGER
-  MODERATOR
-  VIP
-}
-
-enum Operation {
-  CALL
-  PUT
-}
-
-enum Expiration {
-  M1
-  M5
-  M15
-  M30
-  H1
-}
-
-enum Result {
-  WIN
-  LOSS
-}
-
-enum Status {
-  WAITING_PAYMENT
-  UNPAID
-  PAID
-  CANCELED
-}
+// This is your Prisma schema file,
+// learn more about it in the docs: https://pris.ly/d/prisma-schema
+
+datasource db {
+  provider = "postgresql"
+  url = "***"
+}
+
+generator client {
+  provider = "prisma-client-js"
+}
+
+model User {
+  @@map("users")
+
+  id                         String                    @id @default(uuid())
+  name                       String
+  email                      String                    @unique
+  username                   String                    @unique
+  password                   String
+  profile                    Profile
+  recovery_password_requests RecoveryPasswordRequest[]
+
+  referrals Profile[] @relation("Profile_referral")
+
+  created_at DateTime @default(now())
+  updated_at DateTime @default(now())
+}
+
+model Profile {
+  @@map("profiles")
+
+  id               String                @id @default(uuid())
+  user             User                  @relation(fields: [user_id], references: [id])
+  referral_id      String                @unique
+  user_id          String
+  referral         User?                 @relation("Profile_referral", fields: [referral_user_id], references: [id])
+  referral_user_id String?
+  roles            Role[]
+  statistics       Statistics
+  subscriptions    PagarMeSubscription[]
+
+  created_at DateTime @default(now())
+  updated_at DateTime @default(now())
+}
+
+model Statistics {
+  @@map("statistics")
+
+  id         String   @id @default(uuid())
+  profile    Profile  @relation(fields: [profile_id], references: [id])
+  profile_id String
+  wins       Signal[] @relation("Signal_won_by", references: [id])
+  losses     Signal[] @relation("Signal_lost_by", references: [id])
+
+  created_at DateTime @default(now())
+  updated_at DateTime @default(now())
+}
+
+model Signal {
+  @@map("signals")
+
+  id           String     @id @default(uuid())
+  currency     String
+  date         DateTime
+  operation    Operation
+  expiration   Expiration
+  result       Result?
+  gales        Int        @default(0)
+  availableFor Role[]
+
+  won_by  Statistics[] @relation("Signal_won_by", references: [id])
+  lost_by Statistics[] @relation("Signal_lost_by", references: [id])
+
+  created_at DateTime @default(now())
+  updated_at DateTime @default(now())
+}
+
+model RecoveryPasswordRequest {
+  @@map("recovery_password_requests")
+
+  id        String  @id @default(uuid())
+  user      User    @relation(fields: [user_id], references: [id])
+  user_id   String
+  token     String  @unique
+  recovered Boolean @default(false)
+
+  created_at DateTime @default(now())
+  updated_at DateTime @default(now())
+}
+
+model PagarMeSubscription {
+  @@map("subscriptions")
+
+  id                String   @id @default(uuid())
+  profile           Profile? @relation(fields: [profile_id], references: [id])
+  profile_id        String?
+  subscription_id   Int
+  email             String
+  status            Status
+  checkout_json     String
+  subscription_json String
+  postbacks_json    String[]
+
+  created_at DateTime @default(now())
+  updated_at DateTime @default(now())
+}
+
+enum Role {
+  ADMIN
+  MANAGER
+  MODERATOR
+  VIP
+}
+
+enum Operation {
+  CALL
+  PUT
+}
+
+enum Expiration {
+  M1
+  M5
+  M15
+  M30
+  H1
+}
+
+enum Result {
+  WIN
+  LOSS
+}
+
+enum Status {
+  WAITING_PAYMENT
+  UNPAID
+  PAID
+  CANCELED
+}
```

