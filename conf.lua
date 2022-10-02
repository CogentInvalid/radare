function love.conf(t)
    t.identity = "radare"
    t.window.title = "RADARE"
    t.window.width = 800
    t.window.height = 800
    t.window.vsync = 0
    t.window.resizable = true
    t.modules.joystick = false
    t.window.icon = "assets/img/icon.png"
end