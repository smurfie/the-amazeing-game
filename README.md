# The amazeing game
A 3D maze game made with unity

# Backstory
I made this game a long time ago with Unity 5.1 and I updated it to Unity 2018.1 to be able to export it to WebGL. I wasn't able to update it any further due to the deprecation of the Unityscript. I tried to upgrade it to C# but the automatic tool failed. I uploaded to github to have an online copy of it.

# Description
The game is incomplete as you can see in some of the UI elements (No stars, neither level select options). There is only one level and if you pass it will load a new maze with more complexity. There is also the option to see an intro of each level in a Game of Thrones style activating by code `Assets/Scripts/GameController.js`:
```
private var animations: boolean = true;
```

# Play it
You can play:
- Without intro ([link](https://html-games.herokuapp.com/game/maze3d))
- With intro ([link](https://html-games.herokuapp.com/game/maze3dGoT))
