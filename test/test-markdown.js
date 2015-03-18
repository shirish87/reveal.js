
var reveal = new Reveal('.reveal');

reveal.addEventListener( 'ready', function() {

	QUnit.module( 'Markdown' );

	test( 'Vertical separator', function() {
		strictEqual( document.querySelectorAll( '.reveal .slides>section>section' ).length, 2, 'found two slides' );
	});


} );

reveal.initialize();

