
var reveal = new Reveal('.reveal');

reveal.addEventListener( 'ready', function() {

	// Only one test for now, we're mainly ensuring that there
	// are no execution errors when running PDF mode

	test( 'Reveal.isReady', function() {
		strictEqual( reveal.isReady(), true, 'returns true' );
	});


} );

reveal.initialize({ pdf: true });

