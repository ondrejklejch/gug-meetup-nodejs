var http = require( 'http' ),
    URL = require( 'url' ),
    windowFactory = require( './window.js' ),
    window, Highcharts, $;    

windowFactory.createWindow( function( newWindow ) {
    window = newWindow;
    $ = window.$;
    Highcharts = window.Highcharts;

    http.createServer( function ( req, res ) {
        if( !req.url || req.url == 'favicon.ico' ) {
            res.end();
            return;
        }        

        renderChartToSVG( function( svg ) {  
            renderSVGToCanvas( svg, function( canvas ) {
                outputCanvasToResponse( canvas, res );
            } );
        } );
    } ).listen( 1337, "127.0.0.1" );

    console.log( 'Server running at http://127.0.0.1:1337/' );
} );


function renderChartToSVG( callback ) {
    var options = getOptions();
    var $container = $( '<div id="' + options.chart.renderTo + '"></div>' );
    $container.appendTo( window.document.body );        
    var chart = new Highcharts.Chart( options );
        
    callback( $container.children().html() );
}


function getOptions() {
    return {
        "chart": {
            "renderTo": "container",
            "type": "spline",
            "width": 500,
            "height": 400,
        },
        "title": {
            "text": "Followers"
        },
        "xAxis": {
            "type": "datetime",
        },
        "yAxis": [{
            "title": {
                "text": "Followers"
            }
        }],
        "legend" : {
            "enabled" : false,
        },
        "series": [{
            "name": "Followers",
            "animation": false,
            "data": [
                [Date.UTC( 2012, 0, 18), 16524537],
                [Date.UTC( 2012, 0, 19), 16567219],
                [Date.UTC( 2012, 0, 20), 16584627],
                [Date.UTC( 2012, 0, 21), 16616110],
                [Date.UTC( 2012, 0, 22), 16649000],
                [Date.UTC( 2012, 0, 23), 16682352],
                [Date.UTC( 2012, 0, 24), 16713731],
                [Date.UTC( 2012, 0, 25), 16744266],
                [Date.UTC( 2012, 0, 26), 16773029],
                [Date.UTC( 2012, 0, 27), 16804077],
                [Date.UTC( 2012, 0, 28), 16836582],
                [Date.UTC( 2012, 0, 29), 16875308],
                [Date.UTC( 2012, 0, 30), 16913783],
                [Date.UTC( 2012, 0, 31), 16943339]
            ]
        }]
    };
}


function renderSVGToCanvas( svg, callback ) {
    window.canvas.style = function() {};
    window.canvg( window.canvas, svg );

    callback( window.canvas );
}


function outputCanvasToResponse( canvas, response ) {
    var stream = canvas.createPNGStream(); 
    response.writeHead( 200, { 'Content-Type': 'image/png' } );

    stream.on('data', function(chunk){
        response.write(chunk);
    });

    stream.on('end', function(){
        response.end();
    });
}
