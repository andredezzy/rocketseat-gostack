# Migration `20200717072444-add-referral-id-field-to-profile-model`

This migration has been generated by André 'Dezzy' at 7/17/2020, 7:24:44 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."profiles" ADD COLUMN "referral_id" text  NOT NULL ;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200717065702-alter-referral-field-set-optional..20200717072444-add-referral-id-field-to-profile-model
--- datamodel.dml
+++ datamodel.dml
@@ -2,9 +2,9 @@
 // learn more about it in the docs: https://pris.ly/d/prisma-schema
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 generator client {
   provider = "prisma-client-js"
@@ -31,8 +31,9 @@
   @@map("profiles")
   id               String                @id @default(uuid())
   user             User                  @relation(fields: [user_id], references: [id])
+  referral_id      String
   user_id          String
   referral         User?                 @relation("Profile_referral", fields: [referral_user_id], references: [id])
   referral_user_id String?
   roles            Role[]
```


