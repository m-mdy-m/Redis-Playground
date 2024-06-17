-- Running Lua Script File Using redis-cli
-- Syntax :  redis-cli --eval fileName.lua keys , argv

local key = KEYS[1];
local value = ARGV[1];

local oldValue = redis.call('GET', key);

if (oldValue == false) then
  redis.call('SET', key, value);
  return {key, value};
else
  return {key, oldValue};
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
