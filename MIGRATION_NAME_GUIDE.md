# 📝 Migration Name Guide

## When Prisma Asks for Migration Name

When you run:
```bash
npm run prisma:migrate
```

You'll see this prompt:
```
× Enter a name for the new migration: ...
```

## ✅ What to Type

Type: **`init`** (then press Enter)

This is the standard name for the first migration that creates all your database tables.

---

## Complete Example

```bash
PS D:\FuelEU Maritime\Backend> npm run prisma:migrate

Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma
Datasource "db": PostgreSQL database "fueleu_maritime", schema "public" at "localhost:5432"

× Enter a name for the new migration: init
   [Type "init" here and press Enter]

✔ Created migration `20240101120000_init`
✔ Applied migration `20240101120000_init` in 234ms
```

---

## Important Notes

1. **Type exactly:** `init` (lowercase, no quotes)
2. **Press Enter** after typing
3. You'll see confirmation messages after

---

## Other Migration Names (for future)

After the first migration, you can use descriptive names like:
- `add_user_table`
- `update_route_schema`
- `add_banking_fields`

But for now, just use: **`init`**

---

## After Migration

After you type `init` and press Enter, you should see:

```
✔ Created migration `20240101120000_init`
✔ Applied migration `20240101120000_init` in XXXms

The following migration(s) have been created and applied from new schema changes:

  migrations/
    └─ 20240101120000_init/
      └─ migration.sql

Your database is now in sync with your schema.
```

Then you can run:
```bash
npm run prisma:seed
```

---

**🎯 Just type `init` when asked!**

