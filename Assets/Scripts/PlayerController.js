#pragma strict

var speed: float = 3; //From 3 to 25 with inertia; From 3 to 10 without
var gameController: GameController;
var cameraController: CameraController;
var inertia: boolean = false;

private var rb: Rigidbody;

function Start() {
	rb = GetComponent.<Rigidbody>();
}

function FixedUpdate () {
	if (gameController.gameOver) {
		rb.velocity = Vector3(0,0,0);
		rb.rotation = Quaternion.identity;
	} else if(!cameraController.isAnimating) {
		var movement: Vector3;
		if (inertia) {
			var moveHorizontal = Input.GetAxis("Horizontal");
			var moveVertical = Input.GetAxis("Vertical");
			
			//Add some friction if not moving
			if (moveHorizontal == 0) rb.velocity.x /= 1.2;
			if (moveVertical == 0) rb.velocity.z /= 1.2;
			
			movement = new Vector3(moveHorizontal, 0.0f, moveVertical);
			rb.AddForce(movement * speed);
		} else {		
			var h:float = Input.GetAxisRaw ("Horizontal");
			var v:float = Input.GetAxisRaw ("Vertical");
			movement = new Vector3(h, 0f, v);
			movement = movement.normalized * speed * Time.deltaTime;

			// Move the player to it's current position plus the movement.
			rb.velocity.x = 0;
			rb.velocity.z = 0;
	        rb.MovePosition (transform.position + movement);
		}        
	}
}

function changeInertia(){
	inertia = !inertia;
}