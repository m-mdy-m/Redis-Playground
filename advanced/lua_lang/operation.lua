nothing = nil
-- print(nothing)
bool1 = true
bool2 = false
-- print( bool1,bool2)
num1,num2 = 2,1
-- print(num1,num2)
msg = "this is message"
-- print(msg)

n1 = 4
n2 =0.4
n3 = 4.57e-3
n4 = 0.3e12
n5 = 5e+20
-- print(n1,n2,n3,n4,n5)


-- Strings
-- =============================================

-- 1. Lua is eight-bit clean and to strings may contains
--     characters with any numric value, including embedded zeros.

-- 2. You can store any binary data into a string too.
-- 3. Automatic memory managment


a = "this is a line"
b = "this is a second line"
-- print(a,b)

-- \n
-- \r
-- \""
-- \'

-- print("first line \nsecond line")


html = [[
    <html>
        <head>
            <title>Test Title</title>
        </head>
    </html>
]]
-- print(html)

-- line = io.read()
-- print(line)
x = "one Strings"
y = string.gsub(x,"one","two")

-- print(x)
-- print(y)

-- Operation

m1,m2,m3,m4,m5 = 10,20,30,.5,10

-- print(
--     '+ ->',m1 + m2,
--     '* ->',m1 * m2,
--     '/ ->',m1 / m3,
--     '- ->',m1 - m2,
--     "<=  ->", m1 <= m2,
--     "~=  ->", m1 ~= m5
-- )
-- print (4 and 6) -- The highest value
-- print(not nil) -- true
-- print(not false) -- true

-- print(4 or 6) -- 4

--- String Operation

msg3 = "test"
msg4 = "test4"
print(msg3 .. msg4)
