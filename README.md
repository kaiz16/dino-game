In this session, you will be building a Dino game/T-rex runner. The game is a simple game of running and jumping obstacles. The goal is to acheive the highest score possible.

Originally, the game was developed by Google and built into the Google Chrome web browser. The game was written in JavaScript and uses HTML5 Canvas. You will be building a replica of this game using HTML, CSS, and JavaScript.

Example can be found here: https://kaiz16.github.io/dino-game/

The game must have the following features:

- A t-rex character that can jump over obstacles by pressing the spacebar. A sound effect should be played when the t-rex jumps.
- The jump animation should be smooth and natural. _Bonus_ if you can include the gravity effect.
- A moving ground and obstacles. The ground and obstacles should scroll endlessly to the left and the obstacles should be randomly generated.
- A score counter that tracks the score of the player. The score should increase gradually as long as the game is running.
- For every 100 points scored, a sound effect should play and the speed of the ground and obstacles should increase slowly.
- When the t-rex character collides with an obstacle, a sound effect should play and the game should end.

You can download the resources for this game from here: https://drive.google.com/file/d/1kpVvcHTgJ07OliyqTGSt7GQQsu3ZFZqm/view?usp=sharing

**Note**:  
This is a font that you can use in your game. You can find it here: https://www.google.com/fonts/specimen/VT323

**Hint 1**:  
Use window.requestAnimationFrame() to constantly update the game such as checking for collisions, generating obstacles, and updating the score. Using this function will make your game run smoothly. You can find the documentation here: https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame

**Hint 2**:  
For the collision detection, you can use the following code:

```js
function isCollision(dinoRect, cactusRect) {
  // AABB - Axis-aligned bounding box
  return (
    dinoRect.x < cactusRect.x + cactusRect.width &&
    dinoRect.x + dinoRect.width > cactusRect.x &&
    dinoRect.y < cactusRect.y + cactusRect.height &&
    dinoRect.y + dinoRect.height > cactusRect.y
  );
}
```

**Hint 3**:  
You can use CSS animations to move the ground and obstacles from the left to the right. You can find the documentation here: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations. Note that you can still use the `requestAnimationFrame()` function to move the ground and obstacles but an easier way to do this is to use CSS animations directly.

**Hint 4**:
For the gravity effect, you can use the following bezier curve:

```css
animation-timing-function: cubic-bezier(0.33333, 0.66667, 0.66667, 1) /* Before jump */
animation-timing-function: cubic-bezier(0.33333, 0, 0.66667, 0.33333) /* While jumping */
```

_Good luck!_
