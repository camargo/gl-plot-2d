# gl-plot-2d

This is a Web Component that wraps [gl-plot2d](https://github.com/gl-vis/gl-plot2d).

![Line Graph](http://i.imgur.com/WMq7o80.png)

## Build

```
npm i yarn -g
yarn install
npm run build:dev
```

## Average Draw Times (ms)

These were calculated by taking the average of 20 individual draw calls.

|                               | 10,000 Points | 100,000 Points | 1,000,000 Points |
|-------------------------------|---------------|----------------|------------------|
| Chrome (56.0.2924.87)         | 4.208ms       | 4.399ms        | 4.460ms          |
| Firefox (51.0.1)              | 5.006ms       | 5.573ms        | 7.272ms          |

For info [here](https://docs.google.com/spreadsheets/d/1DDMUAgubN-3iSdNFhZZJbHULuGKRHWXufoiW4uKe6s8/edit?usp=sharing).
