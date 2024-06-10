--[[

Lua - Tables Data Types
================================================
1. They are similar to Redis Hashes
2. Its associated arrays
3. No fixed size - Add as manay elements you want!
4. Tables are used to represent;
    - arrays
    - symbol tables
    - sets
    - records
    - queues and more.
5. Tables are objects i.e
    Keys and Values
6. Syntax to create a table 

    variable = {}


]]

-- 1. Create a table

tbl1 = {}
tbl1[1] = 1
-- print(tbl1[1])
tbl1['key'] = "test"
-- print(tbl1["key"])

-- 2. Add a value 
tbl1.key1 = 'test2'

-- print(tbl1[1],tbl1["key"],tbl1['key1'])

-- 3. Assign a key

-- print(tbl1)


-- 4. Create a single dimension table with pre-define values
tbl_days = {"monday","tuesday","wendsday" }

-- 5. How to access data elements in a table
-- print(tbl_days)
-- print(tbl_days[1])
-- 6. For single dimension table, can we put start index at 0 and not 1?
a = {x=1,y=2}
-- print(a.x)

-- 7. Create a key=value pairs tables

tbl_users_1 = {fname="mahdi", lname="mamashli", age=20}
-- print(tbl_users_1)
-- print(tbl_users_1.fname)
-- print(tbl_users_1['fname'])

-- 8. Directly assign a value to a table key

tbl_users_1.fname = 'John2'
-- print(tbl_users_1.fname)
-- 9. Remove a field
tbl_users_1.age = nil
print(tbl_users_1.age)

-- 10. tables are long data tables

tbl_days2 = {[0]="Monday", "tuesday","wendsday"}
print(tbl_days2[0])