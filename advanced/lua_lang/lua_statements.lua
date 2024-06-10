x=10
if x > 51 then 
    print("X > 51")
elseif x==10 then
    print("X = 10")
else 
    -- print("X is not there")
end


-- y = x > 5 and print("X> 5")



----------===========================
print("LOOP SECTION")

for num1= 1,10
do
    -- print(num1)
end

-- Create 50 new Elm
t = {}
-- for i=1,50
-- do
--     t[i]=i+10
-- end
-- print(t[1],t[2])

a= {}
-- for i =1,5
-- do
--     a[i] = io.read()
-- end
-- print(a[1],a[2])

-- traverse all values in an array of table

t1 = {1,2,3,4,5,6}
for i,v in ipairs(t1)
do
    -- print(v)
    print(i)
end


-- print reverse days of the week

days = {
    "monday",
    "tuesday",
    "wendsday",
    "thursday",
    "friday",
    "saturday",
    "sunday"
}
-- for i=#days , 1,-1
-- do
--     value = days[i]
--     print(i .. ":" .. value)
-- end

for i=1 , #days
do
    print(days[#days +1 -i])
end