#pragma strict

var gameController: GameController;

function OnTriggerEnter(other: Collider) {
	if (other.tag == "Player") {
		gameController.LoadNextLevel();
	}
}