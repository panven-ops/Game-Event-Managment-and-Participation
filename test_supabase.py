from supabase_client import supabase

def test_connection():
    res = supabase.storage.list_buckets()
    print(res)

test_connection()
