#pragma strict

private var animate: boolean = false;
private var velocity: float;
private var offset: int;

//Velocity and offset are checked so in the worst case they will finish before the camera animation
function Animate () {
	transform.position.y = -0.6;
	animate = true;
	velocity = Random.Range(0.001, 0.01);
	offset = Random.Range(0, 300);
}

function FixedUpdate(){
	if (animate && transform.position.y <= 0.5) {
		if (offset > 0) {
			offset--;
		} else {
			transform.position.y = Mathf.Min(transform.position.y + 0.01, 0.5);
		}
	} else {
		animate = false;
	}
}