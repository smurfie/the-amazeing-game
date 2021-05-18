#pragma strict

static var defaultMazeWidth: int = 6;
static var defaultMazeHeight: int = 4;

class Maze {
	var width: int;
	var height: int;
	var vWalls: boolean[,];
	var hWalls: boolean[,];
	var spread: int;
	var squares: boolean[,]; //Squares visitables
}

class MazeLonguestPath {
	var ini: Vector2;
	var end: Vector2;
	var length: int = 0;
	var maxHeight: int = 0;
	var maxHeightNode: Vector2;
}

static function CreateMaze() {
	return CreateMaze(defaultMazeWidth, defaultMazeHeight);
}

static function CreateMaze(width: int, height: int) {
	var maze: Maze = new Maze();
	maze.width = width;
	maze.height = height;
	
	InitializeMaze(maze);
	MazeIterativeCreate(maze);
	
   	return maze;
}

// squares[i,j] all to false (unexplored)
// hWalls[i,j] and vWals[i,j] all to true (all walls up)
static function InitializeMaze(maze: Maze) {
	maze.squares = new boolean[maze.height,maze.width];
	maze.vWalls = new boolean[maze.height,maze.width-1];
	maze.hWalls = new boolean[maze.height-1,maze.width];
	maze.spread = Random.Range(15,61);

	for (var i=0;i<maze.height;i++) {
		for (var j=0;j<maze.width;j++) {
			maze.squares[i,j] = false;
			if (i<maze.height-1) {
				maze.hWalls[i,j] = true;
			}
			if (j<maze.width-1) {
				maze.vWalls[i,j] = true;
			}
		}
	}
}

//Create a Tree inside the Maze and take down the walls
//Walls are minimum size (not a square)
static function MazeIterativeCreate(maze: Maze) {
   var x: int = Random.Range(0,maze.height);
   var y: int = Random.Range(0,maze.width);
   maze.squares[x,y]=true;
   var path: List.<Vector2> = new List.<Vector2>();
   path.Add(new Vector2(x,y));
   while (path.Count>0) {
      var square: Vector2;
      var index: int;
      var options: List.<int[]> = new List.<int[]>();
      var newPath: int[];      
      if (Random.Range(0,100) > maze.spread) { //Continue path
         index = path.Count-1;
      
      } else { //New path
         index = Random.Range(0, path.Count);
      }
      square = path[index];
      OptionsAdd(maze, options,square[0]-1,square[1],square[0]-1,square[1],1);
      OptionsAdd(maze, options,square[0]+1,square[1],square[0],square[1],1);
      OptionsAdd(maze, options,square[0],square[1]-1,square[0],square[1]-1,0);
      OptionsAdd(maze, options,square[0],square[1]+1,square[0],square[1],0);
      if (options.Count == 0) {
         path.RemoveAt(index);
      } else {
         newPath=options[Random.Range(0, options.Count)];
         maze.squares[newPath[0],newPath[1]]=true;
         if (newPath[4]) {
            maze.hWalls[newPath[2],newPath[3]]=false;
         } else {
            maze.vWalls[newPath[2],newPath[3]]=false;
         }                
         path.Add(new Vector2(newPath[0],newPath[1]));
      }
   }
}

static function OptionsAdd(maze: Maze, options: List.<int[]>, x: int, y: int, wallx: int, wally: int, horizontal: int) {
	if (x>=0 && x<maze.height && y>=0 && y<maze.width && !maze.squares[x,y]) {
		var option = new int[5];
		option[0] = x;	
		option[1] = y;
		option[2] = wallx;
		option[3] = wally;
		option[4] = horizontal;
      	options.Add(option);
   }
}

//Draw the maze
static function DrawMaze(maze: Maze, wall:GameObject, borderWallsWidth: float, wallsWidth: float, animations: boolean) {	
	//Borders
	var scale: Vector3 = wall.transform.localScale;
	var position: Vector3 = wall.transform.position;
	scale.x = maze.width + borderWallsWidth*2;
	scale.z = borderWallsWidth;
	wall.transform.localScale = scale;
	Instantiate(wall, new Vector3((maze.width+1.0f)/2, wall.transform.position.y, 0), Quaternion.identity);
	Instantiate(wall, new Vector3((maze.width+1.0f)/2, wall.transform.position.y, maze.height+1.0f), Quaternion.identity);
	scale.x = borderWallsWidth;
	scale.z = maze.height + borderWallsWidth*2;
	wall.transform.localScale = scale;
	Instantiate(wall, new Vector3(0, wall.transform.position.y, (maze.height+1.0f)/2), Quaternion.identity);
	Instantiate(wall, new Vector3(maze.width+1.0f, wall.transform.position.y, (maze.height+1.0f)/2), Quaternion.identity);
	
	//Vertical Walls
	wall.transform.localScale.x = wallsWidth;
	for (var j=0;j<maze.width-1;j++) {
		var length = 0;
		for (var i=0;i<maze.height;i++) {
			if(maze.vWalls[i,j]) {
				length++;				
			} else if (length>0) {
				wall.transform.localScale.z = length + wallsWidth;
				InstantiateAndAnimate(wall, new Vector3(j+1.5f, wall.transform.position.y, i+0.5-(length/2.0f)), Quaternion.identity, animations);
				length = 0;
			}
		}
		if (length>0) {
			wall.transform.localScale.z = length + wallsWidth;
			InstantiateAndAnimate(wall, new Vector3(j+1.5f, wall.transform.position.y, i+0.5-(length/2.0f)), Quaternion.identity, animations);
		}
	}
	//Horizontal Walls
	wall.transform.localScale.x = 1 + wallsWidth;
	wall.transform.localScale.z = wallsWidth;
	for (i=0;i<maze.height-1;i++) {
		length = 0;
		for (j=0;j<maze.width;j++) {
			if (maze.hWalls[i,j]) {
				length++;
			} else if (length>0) {
				wall.transform.localScale.x = length + wallsWidth;
				InstantiateAndAnimate(wall, new Vector3(j+0.5-(length/2.0f), wall.transform.position.y, i+1.5f), Quaternion.identity, animations);
				length = 0;
			}
		}
		if (length>0) {
			wall.transform.localScale.x = length + wallsWidth;
			InstantiateAndAnimate(wall, new Vector3(j+0.5-(length/2.0f), wall.transform.position.y, i+1.5f), Quaternion.identity, animations);
		}
	}
}

static function InstantiateAndAnimate(wall:GameObject, position: Vector3, rotation: Quaternion, animations: boolean) {
	var newWall: GameObject;
	newWall = Instantiate(wall, position, rotation);
	if (animations) {
		newWall.GetComponent(WallController).Animate();
	}
	return newWall;
}

static function longuestPath(maze: Maze) {
	var root: Vector2 = new Vector2(0,0);
	return longuestPathRec(maze, root, new Vector2(-10,-10));	
}

static function longuestPathRec(maze: Maze, node: Vector2, nodeAnt: Vector2): MazeLonguestPath {
	var childrenSolutions: List.<MazeLonguestPath> = new List.<MazeLonguestPath>();
	childrenSolutions.Add(longuestPathRecChildren(maze, node, new Vector2(node.x-1, node.y), new Vector2(node.x-1, node.y), true, nodeAnt));
	childrenSolutions.Add(longuestPathRecChildren(maze, node, new Vector2(node.x+1, node.y), new Vector2(node.x, node.y), true, nodeAnt));
	childrenSolutions.Add(longuestPathRecChildren(maze, node, new Vector2(node.x, node.y-1), new Vector2(node.x, node.y-1), false, nodeAnt));
	childrenSolutions.Add(longuestPathRecChildren(maze, node, new Vector2(node.x, node.y+1), new Vector2(node.x, node.y), false, nodeAnt));
	var solution = new MazeLonguestPath();
	solution.maxHeightNode = node;
	solution.ini = node;
	solution.end = node;
	var secondMaxHeight: int = 0;
	var secondMaxHeightNode: Vector2 = node;
	for (var childrenSolution: MazeLonguestPath in childrenSolutions) {
		//Update the maxHeight (in solution) and the secondMaxHeight (temp var)
		if (childrenSolution.maxHeight > secondMaxHeight) {
			if (childrenSolution.maxHeight > solution.maxHeight) {
				secondMaxHeight = solution.maxHeight;
				secondMaxHeightNode = solution.maxHeightNode;
				solution.maxHeight = childrenSolution.maxHeight;
				solution.maxHeightNode = childrenSolution.maxHeightNode;
			} else {
				secondMaxHeight = childrenSolution.maxHeight;
				secondMaxHeightNode = childrenSolution.maxHeightNode;
			}			
		}
		//Update the longuest path
		if (childrenSolution.length > solution.length) {
			solution.length = childrenSolution.length;
			solution.ini = childrenSolution.ini;
			solution.end = childrenSolution.end;
		}
	}
	//Add 1 to the maxHeight
	solution.maxHeight++;
	
	//Finally compare if the largest path of the children is largest than the sum of the to maxheights of the two maximum children plus the root
	if (solution.length < solution.maxHeight+secondMaxHeight) {
		solution.length = solution.maxHeight+secondMaxHeight;
		solution.ini = solution.maxHeightNode;
		solution.end = secondMaxHeightNode;
	}        
	return solution;
}

static function longuestPathRecChildren(maze: Maze, nodeAct: Vector2, nodeNew: Vector2, wall: Vector2, horizontal: boolean, nodeAnt: Vector2) {
	if (nodeNew.x>=0 && nodeNew.x<maze.height && nodeNew.y>=0 && nodeNew.y<maze.width && 
			(nodeNew.x!=nodeAnt.x || nodeNew.y!=nodeAnt.y) &&
			((horizontal && !maze.hWalls[wall.x,wall.y]) || (!horizontal && !maze.vWalls[wall.x,wall.y]))) {
		return longuestPathRec(maze, nodeNew, nodeAct);
	}
	return new MazeLonguestPath();
}