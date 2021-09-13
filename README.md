# Project Space Janitor
This is the repo containing the source code for the game that's been submitted to the [JS13K game jam](https://js13kgames.com/)

## Description
This is our first ever deployed game, so many things were learned and many bugs remain, but it is playable (for the most part). Known issue: player seemingly randomly gets to the game over state ... if anyone can see the bug, we'd love to hear about it!

## Running
Start by installing the dependencies: `npm install`, then run:
`npm start` for the development version, or
`npm run build` to generate the ZIP that was submitted. Open the zip and open the `index.[hash].html` in either Chrome or Firefox (those browsers were tested, but any modern browser *should* work)

## Game Engine
This was a home-grown game engine with a very very basic physics engine (`lib/Physics.js`). Why home-grown? Why not? :)
The main game script is `lib/game.js`. The `setup()` function is called first which then calls `main()`. The latter runs using the `requestNextAnimationFrame()`.

### Collision Detection
The collision detection works by checking if any extent (corner of the rectangles) is closer to the center of an object than that object's own extents. If it is, then a collision was detected.