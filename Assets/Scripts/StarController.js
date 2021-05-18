#pragma strict

static var numStars: int = 0;

static function setNumStars(n: int) {
	numStars = n;
}

static function incrementStars() {
	numStars++;
}

function Update(){
	GetComponentInChildren(Text).text = numStars + " / 100";
}