# Random Jumps

Mini webapp using React to animate a knight's random walk on a chessboard.

![Coverage lines](https://miachenmtl.github.io/random-jumps/coverage/badge-lines.svg)
![Coverage functions](https://miachenmtl.github.io/random-jumps/coverage/badge-functions.svg)
![Coverage branches](https://miachenmtl.github.io/random-jumps/coverage/badge-branches.svg)
![Coverage statements](https://miachenmtl.github.io/random-jumps/coverage/badge-statements.svg)

[Demo](https://miachenmtl.github.io/random-jumps)

## Background

If a knight starts in the corner of an empty chessboard, and makes random moves, how long will it take on average to return to its starting square? The answer, [according](https://www.reddit.com/r/math/comments/1k0hg4/what_is_the_expected_number_of_moves_a_knight/) [to](https://www.youtube.com/watch?v=63HHmjlh794) [math](https://math.stackexchange.com/questions/1588958/knight-returning-to-corner-on-chessboard-average-number-of-steps), is 168. This number surprised me, since there's a one in six chance that it will take just two moves to return, so I made this program to see for myself.

If you look at the statistics in the app, you'll likely find that the average will indeed settle to around 168, but it will take a long time. This is because there's a relatively large probability the knight's trip will be relatively short, but there's a small chance that the trip will take hundreds of moves, and it takes a while for these long-haul journeys to raise the average to the expected result.

I haven't been able to find any answer to the related question of how long it will take on average for the knight to reach all 64 squares, but experimentally, it seems to be around 540.

## Features

- Adjustable speed
- English/French language support
- Adjustable board size: 5 - 12 ranks (rows) and 5 - 12 files (columns)
- Heatmap mode
- Adjustable start position
- Statistics for each square and for trip lengths (the number of moves taken to reach the starting square, or to cover all squares)
- Manual mode: can you make a knight's tour (cover all 64 squares in 64 moves)?

## Technical Details

- Legacy browsers not supported, since I wanted to use recentish CSS features like Custom Properties.
- Most of the state management is done using old-school React class components and composition, since there's a lot of logic, but if I were to do it again, I might try making a custom hook that manipulates state along with `useReducer`
- Responsive design
- Extensive testing (>95%) using Jest and React Testing Library
- Strings and constants are separate from components in order to have a single source of truth for both runtime and testing
- I did most of the CSS by myself, I used [Milligram](https://milligram.io/) as a base.
- The knight SVG is taken from WikiCommons:

```
  By en:User:Cburnett - Own work
  This W3C-unspecified vector image was created with Inkscape .,
  CC BY-SA 3.0,
  https://commons.wikimedia.org/w/index.php?curid=1499807
```

- At jet and warp speeds, moves are batched and the knight renders only 10 times per second to avoid inducing headaches/seizures.
- There's some gratuitous trigonometry used to calculate possible knight moves, and the moves are memoized with a POJO. Overengineering is fun!
- Heatmap gradient generated using an unrendered HTML canvas

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
