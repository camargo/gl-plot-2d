# gl-plot-2d

This is a Web Component that wraps [gl-plot2d](https://github.com/gl-vis/gl-plot2d).

![Line Plot](http://i.imgur.com/WMq7o80.png)

## Installation ([npm](https://www.npmjs.com/package/gl-plot-2d))

```
npm install gl-plot-2d --save
```

## Example

- `<gl-plot-2d>` in React - [Demo](https://camargo.github.io/gl-plot-2d/example) / [Code](https://github.com/camargo/gl-plot-2d/tree/master/example)

## Build & Run Example

```
npm install
bash build.sh
```

## Average Draw Times

These were calculated by taking the average of 20 individual draw calls.

|                               | 10,000 Points | 100,000 Points | 1,000,000 Points |
|-------------------------------|---------------|----------------|------------------|
| Chrome (56.0.2924.87)         | 4.208ms       | 4.399ms        | 4.460ms          |
| Firefox (51.0.1)              | 5.006ms       | 5.573ms        | 7.272ms          |
