# AscPublicUtil
Utilities from the ASC engine that are made standalone on purpose. Each one is standalone, meaning you can use one without depending on the other.

All utilities support both CommonJS (e.g. Node.js) and Browser environments.

## What's with the name?
I'm currently working on a web-based ([Electron](http://electron.atom.io)) game. It's comprised of a few different layers on top of plain JS (although the majority is written in CoffeeScript and then transpiled to JS). One of these layers, (the parent engine) I simply call 'Asc'. However, I've found that some of the utilities could easily be made standalone, since they don't really rely on anything related to the engine. For this reason, I made them standalone on purpose, so that anyone could use them.

## Utilities
Here's a list of all the tools and utilities I've made explicitly public:
* [Enum](#Enum)
* [MapRenderer](#MapRenderer)
* [Pathfinder](#Pathfinder)

# <a name='Enum'></a>Enum
A simple set of classes to emulate Enums from Java.

# <a name='MapRenderer'></a>MapRenderer
This is a simple JavaScript utility to generate a cell based map (i.e. game of life, chess) on an HTML canvas.

## <a name='MapRendererFeatures'></a>Features
* Custom cell size (all cells are squares)
* Custom border size
* Specific border rendering
* Markers
  * Squares
  * Triangles for every (cardinal) direction
  * Circles
  * Diamonds
* Paths

# <a name='Pathfinder'></a> Pathfinder
Pathfinder is an [A* pathfinding](//wikipedia.org/wiki/A*_search_algorithm) utility. I created it for a few reasons:
* I needed a pathfinding utility, every one I've found/seen didn't quite fit what I wanted (see Features).
* I wanted the challenege of doing it myself.
* I've yet to find anything that explains *in depth* how A* works, hence the 'challenge' bullet above. In my implementation I explain everything line-by-line, so if you're new to pathfinding, or game programming in general, try looking at the [CoffeeScript source](./src/Pathfinder.coffee#L114-206)

## Features
* Everything that the A* algorithm requires (a Graph and Nodes)
  * Graphs are called Grids in Pathfinder because I thought the name fit better
* You can define which directions a node is allowed to travel. (I will refer to this as allowed neighbor movement)
* You can set a Node's movement cost (default is 1)
* You can tell Pathfinder what movement cost is considered 'impossible'
  * If a Node's movement cost and the total cost of travel is >= to this value, Pathfinder will ignore the node
* You can tell Pathfinder which distance/heuristic formula to use. There are currently 3 available:
  * MANHATTAN - (default) [Manhattan distance](//wikipedia.org/wiki/Taxicab_geometry) (also called Taxicab) is used. Adjacent movement (up, down, left, right) has a cost of 1 and diagonal movement has an implicit (because math) cost of 2.
  * OCTILE - Octile distance is used (adjacent movement has a cost of 1 and diagonal movement has a cost of sqrt(2) (approximated to 1.4))
  * CHEBYSHEV - Adjacent and diagonal movement have the same cost (1)
  * You can also supply a custom function in the form of (a, b) to be used.
