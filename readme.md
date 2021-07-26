# Browser system detect ( beta )

> Get and watch system information in a browser


## Install

```
$ npm install --save browser-system-detect
```


## Usage

```js
import detect from 'browser-system-detect';

let system = detect({bodyClass:true});

window.addEventListener('systemchange',function (e){

    console.log(e.detail)
})
```

Now that you have system rate you can choose to disable/enable consuming website features such as custom fonts, sliders, video autoplay etc...


## Options

Add class to body
- `bodyClass`, default : false

Consider browser not up to date if detected version is prior last version minus `browserVersion`
- `browserVersion`, default : 2

Consider OS not up to date if detected version is prior last version minus `osVersion`
- `osVersion`, default : 1


## Computed data

- `connection`
- `powermode`
- `browser`
- `memory`
- `touch`
- `cpu`
- `screen`
- `os`
- `platform`
- `reduceMotion`
- `score`
- `battery`
- `grade` : A to E
- `rate` : 0 to 10


## Output example

```json
{
    "connection": {
        "effectiveType": "4g"
    },
    "touch": true,
    "powermode": false,
    "grade": "A",
    "browser": {
        "name": "chrome",
        "version": 92,
        "uptodate": true,
        "features": {
            "canvas": true,
            "webgl": true
        }
    },
    "memory": 8,
    "cpu": {
        "core": 8,
        "score": 27063
    },
    "screen": {
        "width": 1920,
        "height": 1080,
        "pixelRatio": 1
    },
    "os": {
        "name": "linux",
        "version": null,
        "uptodate": null
    },
    "platform": "desktop",
    "reduceMotion": false,
    "score": 10,
    "battery": {
        "level": 0.98,
        "charging": true
    }
}
```


## Demo

https://codepen.io/metabolism/full/KKWemRK


## Rate

Rate is somehow subjective, but here is the computation :

```js
let score = 8;

if( system.browser && system.browser.uptodate === false )
    score--;

if( system.platform === 'mobile' )
    score--;

if( system.os && system.os.uptodate === false )
    score--;

if( (system.battery && system.battery.level < 0.2 && !system.battery.charging) || system.powermode )
    score--;

if( system.memory && system.memory < 4 )
    score--;

if( (system.cpu.core && system.cpu.core < 4) || system.cpu.score < 10000 )
    score--;

if( system.cpu.effectiveType && system.cpu.effectiveType !== "4g" && system.cpu.effectiveType !== "wifi" )
    score--;

if( system.browser.name === 'explorer' )
    score--;

score = Math.round((score/8)*10);
```


## Related

* [battery-level](https://github.com/gillstrom/battery-level) - Get current battery level (OS X, Linux and Windows)
* [bowser](https://github.com/lancedikson/bowser) - A small, fast and rich-API browser/platform/engine detector for both browser and node.


## They love it

[www.groupeavril.com](https://www.groupeavril.com/)


## License

MIT © [Metabolism](http://github.com/wearemetabolism)
