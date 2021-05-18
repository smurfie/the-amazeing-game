#pragma strict

private static var score: int;
private static var stars: int;

private static var scoreStr = "score";
private static var starsStr = "stars";

static function InitVars() {
	score = PlayerPrefs.GetInt(scoreStr);
	stars = PlayerPrefs.GetInt(starsStr);
	StarController.setNumStars(stars);	
}