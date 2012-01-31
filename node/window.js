var jsdom = require( 'jsdom' ),
    Canvas = require( 'canvas' ),
    o3xml = require( 'o3-xml' );

function createWindow( callback ) {
    var window = jsdom.jsdom().createWindow();
    
    window.SVGAngle = true;
    window.canvas = new Canvas(300, 300);
    window.CanvasRenderingContext2D = 0; 
    
    // window doesn't have DOMParser, so we just fake it up
    window.DOMParser = function() {};
    window.DOMParser.prototype.parseFromString = function( xml, type ) {
        return o3xml.parseFromString( xml );
    };
    
    // jsdom doesn't yet support createElementNS, so we just fake it up
    window.document.createElementNS = function(ns, tagName) {
        var elem = window.document.createElement(tagName);    
        elem.getBBox = function() {
            return {
                x: elem.offsetLeft,
                y: elem.offsetTop,
                width: elem.offsetWidth,
                height: elem.offsetHeight
            };
        };
        return elem;
    };

    var baseUrl = 'file:///' + __dirname;
    jsdom.jQueryify(window, baseUrl + '/jquery.js', function(w,jq) {
        var scripts = [
            baseUrl + '/highcharts.src.js',
            baseUrl + '/canvg.js',
            baseUrl + '/rgbcolor.js',
        ];

        loadScripts( window, scripts, callback );
    });
}


function loadScripts( window, scripts, callback ) {
    var count = scripts.length;

    var loadScript = function( src ) {
        var script = window.document.createElement( 'script' );
        script.src = scripts[i];
        script.onload = function() {
            count--;
            
            if( count == 0 ) {
                callback( window );
            }
        }
        
        window.document.body.appendChild( script );
    }
    
    for( var i in scripts ) {
        loadScript( scripts[i] );            
    }
}

exports.createWindow = createWindow;
