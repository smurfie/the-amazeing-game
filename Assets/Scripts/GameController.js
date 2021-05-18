import System.Collections.Generic;
import UnityEngine.UI;

#pragma strict

var wallsWidth: float;
var borderWallsWidth: float;
var initialTimeLeft: float;
var initialWidth: int;
var initialHeight: int;
var cameraObj: GameObject;
var playerController: PlayerController;

var player: GameObject;
var exit: GameObject;
var wall: GameObject;
var levelCanvas: GameObject;
var homeCanvas: GameObject;

private var timeLeft: float;
private var level: int;
private var maze: Maze;
private var timeText: Text;
private var levelText: Text;
private var mazeText: Text;
private var speedText: Text;
private var gameOverText: Text;
private var cameraController: CameraController;
private var animations: boolean = false;

var gameOver: boolean;

function Start () {
	PrefsController.InitVars();
	level = 0;
	timeLeft = initialTimeLeft;
	levelCanvas.SetActive(false);
	homeCanvas.SetActive(true);
	var texts: Component[] = levelCanvas.GetComponentsInChildren(Text, true);
	for (var textComp: Component in texts) {
		var text: Text = textComp as Text;
		switch (text.name) {
			case "TimeText":
				timeText = text;
				break;
			case "LevelText":
				levelText = text;
				break;
			case "MazeText":
				mazeText = text;
				break;
			case "SpeedText":
				speedText = text;
				break;
			case "GameOverText":
				gameOverText = text;
				break;
		}
	}
	cameraController = cameraObj.GetComponent(CameraController);
	LoadNextLevel();
}

function LoadNextLevel() {
	level++;
	LoadLevel();
}

function LoadPreviousLevel() {
	if (level>1) level--;
	LoadLevel();
}

function LoadLevel() {
	DeleteWalls();
	var width = initialWidth * level;
	var height = initialHeight * level;
	
	playerController.speed = Mathf.Min (10, 2+level); //More speed jumps walls
	
	maze = MazeController.CreateMaze(width, height);
	MazeController.DrawMaze(maze, wall, borderWallsWidth, wallsWidth, animations);
	var solution: MazeLonguestPath = MazeController.longuestPath(maze);
	
	timeLeft += (1+level/10)*solution.length/2;
	
	player.transform.position.x = solution.ini.y+1;
	player.transform.position.z = solution.ini.x+1;
	player.SetActive(true);
	exit.transform.position.x = solution.end.y+1;
	exit.transform.position.z = solution.end.x+1;
	exit.SetActive(true);
	
	cameraController.SetStartingPosition(maze);
	if (animations) {
		cameraController.StartAnimation(maze);
	}
}

function DeleteWalls() {
	for (var o:GameObject in FindObjectsOfType(GameObject)) {
		if (o.tag == "Wall") {
			Destroy(o);
		}
	}
}

function Update () {
	if (cameraController.isAnimating) return;
	if (!gameOver) {
		timeLeft -= Time.deltaTime;
		timeLeft = Mathf.Max(0.0, timeLeft);
		if (Mathf.Ceil(timeLeft) == 0.0) {
			gameOver = true;
		}
	}
	
	if (Input.GetKeyDown(KeyCode.R)) {
		RestartLevel();
	}
	if (Input.GetKeyDown(KeyCode.N)) {
		LoadNextLevel();
	}
	if (Input.GetKeyDown(KeyCode.P)) {
		LoadPreviousLevel();
	}
	if (Input.GetKeyDown(KeyCode.O)) {
		cameraController.changeCameraType();
	}
	if (Input.GetKeyDown(KeyCode.I)) {
		playerController.changeInertia();
	}
	if (Input.GetKeyDown(KeyCode.G)) {
		animations = !animations;
	}
	
	//Mouse zoom to the ball
	if (Input.GetAxis("Mouse ScrollWheel") > 0 || Input.GetKeyDown(KeyCode.Q)) {
		cameraController.ZoomIn(maze);
	}
	if (Input.GetAxis("Mouse ScrollWheel") < 0 || Input.GetKeyDown(KeyCode.E)) {
		cameraController.ZoomOut(maze);
	}

	DrawTexts();
}

function DrawTexts() {
	var timeLeftInt: int = Mathf.Ceil(timeLeft);
	timeText.text = "Time Left: " + timeLeftInt/60 + ":" + (timeLeftInt%60).ToString("00");
	timeText.color = timeLeft < 10 ? Color.red : Color.white;
	levelText.text = "Level " + level;
	mazeText.text = "Maze " + maze.width + "x" + maze.height;
	speedText.text= "Speed: " + playerController.speed;
	gameOverText.text = gameOver ? "Game Over! Press 'R' to restart" : "";
}

function RestartLevel() {
	Application.LoadLevel(Application.loadedLevel);
}