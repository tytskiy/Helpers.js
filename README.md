How to develop
--------------
1. `git clone https://github.com/tytskiy/Helpers.js.git`
2. `npm i -g gulp`
3. `npm i`
4. `gulp`

Usage
-----

``` js
var helpers = new core.T0.Helpers();

// with reset timer
helpers.wait({
    freq: 100,
    reset: 3000,
    check: function () {
        return window.jQuery;
    },
    success: function () {
        console.log('jQuery was found')
    },
    fail: function () {
        console.log('jQuery wasn\'t found during 3 seconds')
    },
    always: function () {
        console.log('Anyway print something')
    }
});

// with reset function
helpers.wait({
    freq: 100,
    reset: function () {
        return 2 + 2 > -1;
    },
    check: function () {
        return window.Zepto;
    },
    success: function () {
        console.log('Zepto was found')
    },
    fail: function () {
        console.log('Zepto wasn\'t found')
    },
    always: function () {
        console.log('Anyway print something')
    }
});
```

TODO:
-----

Add more examples