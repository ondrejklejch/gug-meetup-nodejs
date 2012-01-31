var casper = require( 'casper' ).create( {
    viewportSize: {
        width: 1024,
        height: 768
    }
} );

var url = casper.cli.get( 0 );
var output = casper.cli.get( 1 );

if( casper.cli.args.length != 2 ) {
    casper.echo( 'Usage: casperjs charts.js URL filename', 'ERROR' );
    casper.exit();
}

casper.start( url, function() {
    this.waitForSelector( '.highcharts-container', function() {
        this.captureSelector( output, '#container .highcharts-container' );
        this.echo( 'Done.' );
    }, function() {
        this.echo( 'Unable to load the address!', 'ERROR' ).exit();
    }, 1000 );
} );

casper.run();
