-- Running Lua Script File Using redis-cli
-- Syntax :  redis-cli --eval fileName.lua keys , argv

-- Convert KEYS[1] (which is a string) to a proper string using tostring()
local key = tostring(KEYS[1]);

-- Convert ARGV[1] (which is also a string) to a proper string using tostring()
local value = tostring(ARGV[1]);

-- Get the old value using redis.call('GET', key)
local oldValue = redis.call('GET', key);

if (oldValue == false) then -- Check if the key doesn't exist (oldValue is nil or false)
  -- Set the key-value pair
  redis.call("SET", key, value);

  -- Return the key and the newly set value
  return { key, value };
else
  -- Key exists, return the key and the existing value
  return { key, oldValue };
end

-- redis-cli --eval ./example_redis_script.lua setKey1 , value2

-- Return : 
-- 1) "setKey1"
-- 2) "value2"
------------------------------------

-- Debugging this script

-- redis-cli --ldb --eval ./addKeyValue.lua setKey1 , value2
------------------------------------

-- Caching this script

-- redis-cli SCRIPT LOAD "$(cat ./addKeyValue.lua)"
------------------------------------

-- Executing this Stored script

-- redis-cli EVALSHA "5828794b7233cb735e77a5346aab6384befa6179" 1 "key1" "val1"
