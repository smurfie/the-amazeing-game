#pragma strict

var player: GameObject;
var exit: GameObject;
var isAnimating: boolean = false;

private var initialX: float;
private var initialY: float;
private var initialZ: float;

static var cameraObj: Camera;

function Start () {
	cameraObj = GetComponent(Camera);
}

function SetStartingPosition(maze: Maze) {
	//Position the camera. The FieldOfView has to see all the maze 
	//In the z axis we give a 20% of white space for the time left
	//Position the y for pherspective and ortographic to be equals
	cameraObj.orthographic = true;
	cameraObj.orthographicSize = Mathf.Max(2+(maze.width+1)/2, 1.2*(2+maze.height/2));
	transform.position.x = 0.5+maze.width/2.0;
	transform.position.y = cameraObj.orthographicSize / Mathf.Tan(Mathf.Deg2Rad * cameraObj.fieldOfView/2);
	transform.position.z = 0.5+maze.height/2.0;
	transform.eulerAngles.x = 90;
	transform.eulerAngles.y = 0;
	transform.eulerAngles.z = 0;
	NormalizeCamera(maze);
	initialX = transform.position.x;
	initialY = transform.position.y;
	initialZ = transform.position.z;
}

function ZoomIn(maze: Maze) {
	cameraObj.main.orthographicSize--;
	NormalizeCamera(maze);
}

function ZoomOut(maze: Maze){
	cameraObj.main.orthographicSize++;
	NormalizeCamera(maze);
}

function changeCameraType(){
	cameraObj.orthographic = !cameraObj.orthographic;
}

//After the zoom puts the camera in the correct position
function NormalizeCamera(maze: Maze) {
	cameraObj.main.orthographicSize = Mathf.Clamp(cameraObj.main.orthographicSize, 3, Mathf.Max(2+(maze.width+1)/2, 1.2*(2+maze.height/2)));
	var widthSpare = Mathf.Max(0,1+maze.width/2.0 - cameraObj.main.orthographicSize*Screen.width/Screen.height);
	transform.position.x = Mathf.Clamp(player.transform.position.x, 0.5+maze.width/2.0-widthSpare, 0.5+maze.width/2.0+widthSpare);
	var heightSpare = Mathf.Max(0,1.2*(1+maze.height/2.0) - cameraObj.main.orthographicSize);
	transform.position.z = Mathf.Clamp(player.transform.position.z, 0.5+maze.height/2.0-heightSpare, 0.5+maze.height/2.0+heightSpare);
	transform.position.y = cameraObj.orthographicSize / Mathf.Tan(Mathf.Deg2Rad * cameraObj.fieldOfView/2);
}

function StartAnimation(maze: Maze) {
	var frame: int;
	var maxZoom: float = 10.0;
	isAnimating = true;
	cameraObj.orthographic = false;
	//Zoom from center to the exit (until height = 5)
	var framesZoom: int = 120;
	for (frame=0; frame<framesZoom; frame++) {
		transform.position.x = initialX-(initialX-exit.transform.position.x)*frame/framesZoom;
		transform.position.y -= (initialY-maxZoom)/framesZoom;
		transform.position.z = initialZ-(initialZ-exit.transform.position.z)*frame/framesZoom;
		yield;
	}
	transform.position.x = exit.transform.position.x;
	transform.position.y = maxZoom;
	transform.position.z = exit.transform.position.z;
	
	//Position to start spin
	var framesPositionSpin: int = 60;
	for (frame=0; frame<framesPositionSpin; frame++) {
		transform.position.y -= 5.0/framesPositionSpin;
		transform.position.z -= 5.0/framesPositionSpin;
		transform.Rotate(-50.0/framesPositionSpin,0,0);
		yield;
	}
	
	//Start spinning
	var framesSpin: int = 180;
	var tempInitialX: float = transform.position.x;
	var tempInitialZ: float = transform.position.z;
	for (frame=0; frame<=framesSpin; frame++) {
		transform.eulerAngles.y = -frame*360.0/framesSpin;
		transform.position.x = tempInitialX + 5.0*Mathf.Sin(Mathf.Deg2Rad * frame * 360.0/framesSpin);
		transform.position.z = tempInitialZ + 5.0*Mathf.Sin(Mathf.Deg2Rad * (frame*360.0/framesSpin-90.0)) + 5.0;
		yield;
	}
	
	//Turn into player while moving to player
	//The idea is putting the camera 2 squares down the player while rotating it continuosly to the player (4 degrees at much)
	var step: float = 0.1 * (1+(maze.width/50));
	while (transform.position.x != player.transform.position.x || transform.position.z != player.transform.position.z-5) {
		transform.position.x += Mathf.Sign(player.transform.position.x - transform.position.x) * 
				Mathf.Min(step,Mathf.Abs(player.transform.position.x - transform.position.x));
		transform.position.z += Mathf.Sign(player.transform.position.z - transform.position.z - 5) * 
				Mathf.Min(step,Mathf.Abs(player.transform.position.z - transform.position.z - 5));
		var finalAngle: float = Mathf.Rad2Deg * Mathf.Atan2(
				player.transform.position.x-transform.position.x, player.transform.position.z-transform.position.z);		
		var finalRotation = (360 + transform.eulerAngles.y - finalAngle) % 360;
		transform.eulerAngles.y = finalRotation > 2  && finalRotation <= 180 ?
				transform.eulerAngles.y - 2 : finalRotation < 358 && finalRotation >= 180 ?
				transform.eulerAngles.y + 2 : finalAngle;
		yield;
	}
	while ((transform.eulerAngles.y + 360) % 360 > 0.01) {
		//Debug.Log((transform.eulerAngles.y + 360) % 360 + " " + ((transform.eulerAngles.y + 360) % 360 >= 180) + " " + Mathf.Max (0, ((transform.eulerAngles.y + 360) % 360) - 4));
		transform.eulerAngles.y = (transform.eulerAngles.y + 360) % 360 >= 180 ? 
				Mathf.Min (360, ((transform.eulerAngles.y + 360) % 360) + 4) :
				Mathf.Max (0, ((transform.eulerAngles.y + 360) % 360) - 4);
		yield;
	}	
	
	//Return to initial position (perspective camera)
	for (frame=0; frame<framesPositionSpin; frame++) {
		transform.position.y += 5.0/framesPositionSpin;
		transform.position.z += 5.0/framesPositionSpin;
		transform.Rotate(50.0/framesPositionSpin,0,0);
		yield;
	}
	
	for (frame=0; frame<framesZoom; frame++) {
		transform.position.x = player.transform.position.x - (player.transform.position.x-initialX)*frame/framesZoom;
		transform.position.y += (initialY-maxZoom)/framesZoom;
		transform.position.z = player.transform.position.z - (player.transform.position.z-initialZ)*frame/framesZoom;
		yield;
	}
	cameraObj.orthographic = false;
	isAnimating = false;
}