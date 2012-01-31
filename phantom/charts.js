var page = new WebPage(),
    address, output, size,
    time = new Date();

if ( phantom.args.length != 2 ) {
    console.log( 'Usage: charts.js URL filename' );
    phantom.exit();
} else {
    address = phantom.args[0];
    output = phantom.args[1];
    page.open( address, function ( status ) {
        if ( status !== 'success' ) {
            console.log( 'Unable to load the address!' );
        } else {
            var rect =  page.evaluate( function() {
                var $el = $( '#container' );
                var offset = $el.offset();

                return {
                    top: offset.top,
                    left: offset.left,
                    width: window.chartWidth,
                    height: window.chartHeight
                }
            } );

            page.clipRect = rect;
            page.viewportSize.height = rect.height + rect.top;
            page.viewportSize.width = rect.width + rect.left;		
            page.render( output );
            console.log( "Done." );
            phantom.exit();
        }
    } );
}
