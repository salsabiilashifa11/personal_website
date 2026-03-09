#!/usr/bin/env python3
"""
Replaces hardcoded localhost:8080 URLs in the SQLite DB with the production base URL.
Usage: python3 migrate_urls.py data.db https://shifasalsabiila.com
"""
import sqlite3
import sys

if len(sys.argv) != 3:
    print("Usage: migrate_urls.py <db_path> <new_base_url>")
    sys.exit(1)

db_path = sys.argv[1]
new_base = sys.argv[2].rstrip("/")
old_base = "http://localhost:8080"

conn = sqlite3.connect(db_path)
cur = conn.cursor()

tables = {
    "books":       ["cover_url"],
    "experiences": ["logo_url"],
    "movies":      ["poster_url"],
    "drumming_media": ["url"],
}

total = 0
for table, cols in tables.items():
    for col in cols:
        cur.execute(f"UPDATE {table} SET {col} = REPLACE({col}, ?, ?) WHERE {col} LIKE ?",
                    (old_base, new_base, f"{old_base}%"))
        n = cur.rowcount
        if n:
            print(f"  {table}.{col}: updated {n} rows")
        total += n

conn.commit()
conn.close()
print(f"Done — {total} total rows updated.")
