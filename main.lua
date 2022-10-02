love.filesystem.setRequirePath("lua/?.lua;?.lua;?/init.lua;lua/?/init.lua")

if (os.getenv("LOCAL_LUA_DEBUGGER_VSCODE") == "1") then
	require("lldebugger").start()
	print("starting debugger")
end

require "Main"