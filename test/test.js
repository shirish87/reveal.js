
// These tests expect the DOM to contain a presentation
// with the following slide structure:
//
// 1
// 2 - Three sub-slides
// 3 - Three fragment elements
// 3 - Two fragments with same data-fragment-index
// 4

var reveal = new Reveal('.reveal');

reveal.addEventListener( 'ready', function() {

	// ---------------------------------------------------------------
	// DOM TESTS

	QUnit.module( 'DOM' );

	test( 'Initial slides classes', function() {
		var horizontalSlides = document.querySelectorAll( '.reveal .slides>section' )

		strictEqual( document.querySelectorAll( '.reveal .slides section.past' ).length, 0, 'no .past slides' );
		strictEqual( document.querySelectorAll( '.reveal .slides section.present' ).length, 1, 'one .present slide' );
		strictEqual( document.querySelectorAll( '.reveal .slides>section.future' ).length, horizontalSlides.length - 1, 'remaining horizontal slides are .future' );

		strictEqual( document.querySelectorAll( '.reveal .slides section.stack' ).length, 2, 'two .stacks' );

		ok( document.querySelectorAll( '.reveal .slides section.stack' )[0].querySelectorAll( '.future' ).length > 0, 'vertical slides are given .future' );
	});

	// ---------------------------------------------------------------
	// API TESTS

	QUnit.module( 'API' );

	test( 'Reveal.isReady', function() {
		strictEqual( reveal.isReady(), true, 'returns true' );
	});

	test( 'Reveal.isOverview', function() {
		strictEqual( reveal.isOverview(), false, 'false by default' );

		reveal.toggleOverview();
		strictEqual( reveal.isOverview(), true, 'true after toggling on' );

		reveal.toggleOverview();
		strictEqual( reveal.isOverview(), false, 'false after toggling off' );
	});

	test( 'Reveal.isPaused', function() {
		strictEqual( reveal.isPaused(), false, 'false by default' );

		reveal.togglePause();
		strictEqual( reveal.isPaused(), true, 'true after pausing' );

		reveal.togglePause();
		strictEqual( reveal.isPaused(), false, 'false after resuming' );
	});

	test( 'Reveal.isFirstSlide', function() {
		reveal.slide( 0, 0 );
		strictEqual( reveal.isFirstSlide(), true, 'true after Reveal.slide( 0, 0 )' );

		reveal.slide( 1, 0 );
		strictEqual( reveal.isFirstSlide(), false, 'false after Reveal.slide( 1, 0 )' );

		reveal.slide( 0, 0 );
		strictEqual( reveal.isFirstSlide(), true, 'true after Reveal.slide( 0, 0 )' );
	});

	test( 'Reveal.isFirstSlide after vertical slide', function() {
		reveal.slide( 1, 1 );
		reveal.slide( 0, 0 );
		strictEqual( reveal.isFirstSlide(), true, 'true after Reveal.slide( 1, 1 ) and then Reveal.slide( 0, 0 )' );
	});

	test( 'Reveal.isLastSlide', function() {
		reveal.slide( 0, 0 );
		strictEqual( reveal.isLastSlide(), false, 'false after Reveal.slide( 0, 0 )' );

		var lastSlideIndex = document.querySelectorAll( '.reveal .slides>section' ).length - 1;

		reveal.slide( lastSlideIndex, 0 );
		strictEqual( reveal.isLastSlide(), true, 'true after Reveal.slide( '+ lastSlideIndex +', 0 )' );

		reveal.slide( 0, 0 );
		strictEqual( reveal.isLastSlide(), false, 'false after Reveal.slide( 0, 0 )' );
	});

	test( 'Reveal.isLastSlide after vertical slide', function() {
		var lastSlideIndex = document.querySelectorAll( '.reveal .slides>section' ).length - 1;
		
		reveal.slide( 1, 1 );
		reveal.slide( lastSlideIndex );
		strictEqual( reveal.isLastSlide(), true, 'true after Reveal.slide( 1, 1 ) and then Reveal.slide( '+ lastSlideIndex +', 0 )' );
	});

	test( 'Reveal.getTotalSlides', function() {
		strictEqual( reveal.getTotalSlides(), 8, 'eight slides in total' );
	});

	test( 'Reveal.getIndices', function() {
		var indices = reveal.getIndices();

		ok( indices.hasOwnProperty( 'h' ), 'h exists' );
		ok( indices.hasOwnProperty( 'v' ), 'v exists' );
		ok( indices.hasOwnProperty( 'f' ), 'f exists' );

		reveal.slide( 1, 0 );
		strictEqual( reveal.getIndices().h, 1, 'h 1' );
		strictEqual( reveal.getIndices().v, 0, 'v 0' );

		reveal.slide( 1, 2 );
		strictEqual( reveal.getIndices().h, 1, 'h 1' );
		strictEqual( reveal.getIndices().v, 2, 'v 2' );

		reveal.slide( 0, 0 );
		strictEqual( reveal.getIndices().h, 0, 'h 0' );
		strictEqual( reveal.getIndices().v, 0, 'v 0' );
	});

	test( 'Reveal.getSlide', function() {
		equal( reveal.getSlide( 0 ), document.querySelector( '.reveal .slides>section:first-child' ), 'gets correct first slide' );
		equal( reveal.getSlide( 1 ), document.querySelector( '.reveal .slides>section:nth-child(2)' ), 'no v index returns stack' );
		equal( reveal.getSlide( 1, 0 ), document.querySelector( '.reveal .slides>section:nth-child(2)>section:nth-child(1)' ), 'v index 0 returns first vertical child' );
		equal( reveal.getSlide( 1, 1 ), document.querySelector( '.reveal .slides>section:nth-child(2)>section:nth-child(2)' ), 'v index 1 returns second vertical child' );

		strictEqual( reveal.getSlide( 100 ), undefined, 'undefined when out of horizontal bounds' );
		strictEqual( reveal.getSlide( 1, 100 ), undefined, 'undefined when out of vertical bounds' );
	});

	test( 'reveal.getSlideBackground', function() {
		equal( reveal.getSlideBackground( 0 ), document.querySelector( '.reveal .backgrounds>.slide-background:first-child' ), 'gets correct first background' );
		equal( reveal.getSlideBackground( 1 ), document.querySelector( '.reveal .backgrounds>.slide-background:nth-child(2)' ), 'no v index returns stack' );
		equal( reveal.getSlideBackground( 1, 0 ), document.querySelector( '.reveal .backgrounds>.slide-background:nth-child(2) .slide-background:nth-child(1)' ), 'v index 0 returns first vertical child' );
		equal( reveal.getSlideBackground( 1, 1 ), document.querySelector( '.reveal .backgrounds>.slide-background:nth-child(2) .slide-background:nth-child(2)' ), 'v index 1 returns second vertical child' );

		strictEqual( reveal.getSlideBackground( 100 ), undefined, 'undefined when out of horizontal bounds' );
		strictEqual( reveal.getSlideBackground( 1, 100 ), undefined, 'undefined when out of vertical bounds' );
	});

	test( 'Reveal.getPreviousSlide/getCurrentSlide', function() {
		reveal.slide( 0, 0 );
		reveal.slide( 1, 0 );

		var firstSlide = document.querySelector( '.reveal .slides>section:first-child' );
		var secondSlide = document.querySelector( '.reveal .slides>section:nth-child(2)>section' );

		equal( reveal.getPreviousSlide(), firstSlide, 'previous is slide #0' );
		equal( reveal.getCurrentSlide(), secondSlide, 'current is slide #1' );
	});

	test( 'Reveal.getProgress', function() {
		reveal.slide( 0, 0 );
		strictEqual( reveal.getProgress(), 0, 'progress is 0 on first slide' );

		var lastSlideIndex = document.querySelectorAll( '.reveal .slides>section' ).length - 1;

		reveal.slide( lastSlideIndex, 0 );
		strictEqual( reveal.getProgress(), 1, 'progress is 1 on last slide' );
	});

	test( 'Reveal.getScale', function() {
		ok( typeof reveal.getScale() === 'number', 'has scale' );
	});

	test( 'Reveal.getConfig', function() {
		ok( typeof reveal.getConfig() === 'object', 'has config' );
	});

	test( 'Reveal.configure', function() {
		strictEqual( reveal.getConfig().loop, false, '"loop" is false to start with' );

		reveal.configure({ loop: true });
		strictEqual( reveal.getConfig().loop, true, '"loop" has changed to true' );

		reveal.configure({ loop: false, customTestValue: 1 });
		strictEqual( reveal.getConfig().customTestValue, 1, 'supports custom values' );
	});

	test( 'Reveal.availableRoutes', function() {
		reveal.slide( 0, 0 );
		deepEqual( reveal.availableRoutes(), { left: false, up: false, down: false, right: true }, 'correct for first slide' );

		reveal.slide( 1, 0 );
		deepEqual( reveal.availableRoutes(), { left: true, up: false, down: true, right: true }, 'correct for vertical slide' );
	});

	test( 'Reveal.next', function() {
		reveal.slide( 0, 0 );

		// Step through vertical child slides
		reveal.next();
		deepEqual( reveal.getIndices(), { h: 1, v: 0, f: undefined } );

		reveal.next();
		deepEqual( reveal.getIndices(), { h: 1, v: 1, f: undefined } );

		reveal.next();
		deepEqual( reveal.getIndices(), { h: 1, v: 2, f: undefined } );

		// Step through fragments
		reveal.next();
		deepEqual( reveal.getIndices(), { h: 2, v: 0, f: -1 } );

		reveal.next();
		deepEqual( reveal.getIndices(), { h: 2, v: 0, f: 0 } );

		reveal.next();
		deepEqual( reveal.getIndices(), { h: 2, v: 0, f: 1 } );

		reveal.next();
		deepEqual( reveal.getIndices(), { h: 2, v: 0, f: 2 } );
	});

	test( 'Reveal.next at end', function() {
		reveal.slide( 3 );

		// We're at the end, this should have no effect
		reveal.next();
		deepEqual( reveal.getIndices(), { h: 3, v: 0, f: undefined } );

		reveal.next();
		deepEqual( reveal.getIndices(), { h: 3, v: 0, f: undefined } );
	});


	// ---------------------------------------------------------------
	// FRAGMENT TESTS

	QUnit.module( 'Fragments' );

	test( 'Sliding to fragments', function() {
		reveal.slide( 2, 0, -1 );
		deepEqual( reveal.getIndices(), { h: 2, v: 0, f: -1 }, 'Reveal.slide( 2, 0, -1 )' );

		reveal.slide( 2, 0, 0 );
		deepEqual( reveal.getIndices(), { h: 2, v: 0, f: 0 }, 'Reveal.slide( 2, 0, 0 )' );

		reveal.slide( 2, 0, 2 );
		deepEqual( reveal.getIndices(), { h: 2, v: 0, f: 2 }, 'Reveal.slide( 2, 0, 2 )' );

		reveal.slide( 2, 0, 1 );
		deepEqual( reveal.getIndices(), { h: 2, v: 0, f: 1 }, 'Reveal.slide( 2, 0, 1 )' );
	});

	test( 'Hiding all fragments', function() {
		var fragmentSlide = document.querySelector( '#fragment-slides>section:nth-child(1)' );

		reveal.slide( 2, 0, 0 );
		strictEqual( fragmentSlide.querySelectorAll( '.fragment.visible' ).length, 1, 'one fragment visible when index is 0' );

		reveal.slide( 2, 0, -1 );
		strictEqual( fragmentSlide.querySelectorAll( '.fragment.visible' ).length, 0, 'no fragments visible when index is -1' );
	});

	test( 'Current fragment', function() {
		var fragmentSlide = document.querySelector( '#fragment-slides>section:nth-child(1)' );

		reveal.slide( 2, 0 );
		strictEqual( fragmentSlide.querySelectorAll( '.fragment.current-fragment' ).length, 0, 'no current fragment at index -1' );

		reveal.slide( 2, 0, 0 );
		strictEqual( fragmentSlide.querySelectorAll( '.fragment.current-fragment' ).length, 1, 'one current fragment at index 0' );

		reveal.slide( 1, 0, 0 );
		strictEqual( fragmentSlide.querySelectorAll( '.fragment.current-fragment' ).length, 0, 'no current fragment when navigating to previous slide' );

		reveal.slide( 3, 0, 0 );
		strictEqual( fragmentSlide.querySelectorAll( '.fragment.current-fragment' ).length, 0, 'no current fragment when navigating to next slide' );
	});

	test( 'Stepping through fragments', function() {
		reveal.slide( 2, 0, -1 );

		// forwards:

		reveal.next();
		deepEqual( reveal.getIndices(), { h: 2, v: 0, f: 0 }, 'next() goes to next fragment' );

		reveal.right();
		deepEqual( reveal.getIndices(), { h: 2, v: 0, f: 1 }, 'right() goes to next fragment' );

		reveal.down();
		deepEqual( reveal.getIndices(), { h: 2, v: 0, f: 2 }, 'down() goes to next fragment' );

		reveal.down(); // moves to f #3

		// backwards:

		reveal.prev();
		deepEqual( reveal.getIndices(), { h: 2, v: 0, f: 2 }, 'prev() goes to prev fragment' );

		reveal.left();
		deepEqual( reveal.getIndices(), { h: 2, v: 0, f: 1 }, 'left() goes to prev fragment' );

		reveal.up();
		deepEqual( reveal.getIndices(), { h: 2, v: 0, f: 0 }, 'up() goes to prev fragment' );
	});

	test( 'Stepping past fragments', function() {
		var fragmentSlide = document.querySelector( '#fragment-slides>section:nth-child(1)' );

		reveal.slide( 0, 0, 0 );
		equal( fragmentSlide.querySelectorAll( '.fragment.visible' ).length, 0, 'no fragments visible when on previous slide' );

		reveal.slide( 3, 0, 0 );
		equal( fragmentSlide.querySelectorAll( '.fragment.visible' ).length, 3, 'all fragments visible when on future slide' );
	});

	test( 'Fragment indices', function() {
		var fragmentSlide = document.querySelector( '#fragment-slides>section:nth-child(2)' );

		reveal.slide( 3, 0, 0 );
		equal( fragmentSlide.querySelectorAll( '.fragment.visible' ).length, 2, 'both fragments of same index are shown' );

		// This slide has three fragments, first one is index 0, second and third have index 1
		reveal.slide( 2, 2, 0 );
		equal( reveal.getIndices().f, 0, 'returns correct index for first fragment' );

		reveal.slide( 2, 2, 1 );
		equal( reveal.getIndices().f, 1, 'returns correct index for two fragments with same index' );
	});

	test( 'Index generation', function() {
		var fragmentSlide = document.querySelector( '#fragment-slides>section:nth-child(1)' );

		// These have no indices defined to start with
		equal( fragmentSlide.querySelectorAll( '.fragment' )[0].getAttribute( 'data-fragment-index' ), '0' );
		equal( fragmentSlide.querySelectorAll( '.fragment' )[1].getAttribute( 'data-fragment-index' ), '1' );
		equal( fragmentSlide.querySelectorAll( '.fragment' )[2].getAttribute( 'data-fragment-index' ), '2' );
	});

	test( 'Index normalization', function() {
		var fragmentSlide = document.querySelector( '#fragment-slides>section:nth-child(3)' );

		// These start out as 1-4-4 and should normalize to 0-1-1
		equal( fragmentSlide.querySelectorAll( '.fragment' )[0].getAttribute( 'data-fragment-index' ), '0' );
		equal( fragmentSlide.querySelectorAll( '.fragment' )[1].getAttribute( 'data-fragment-index' ), '1' );
		equal( fragmentSlide.querySelectorAll( '.fragment' )[2].getAttribute( 'data-fragment-index' ), '1' );
	});

	asyncTest( 'fragmentshown event', function() {
		expect( 2 );

		var _onEvent = function( event ) {
			ok( true, 'event fired' );
		}

		reveal.addEventListener( 'fragmentshown', _onEvent );

		reveal.slide( 2, 0 );
		reveal.slide( 2, 0 ); // should do nothing
		reveal.slide( 2, 0, 0 ); // should do nothing
		reveal.next();
		reveal.next();
		reveal.prev(); // shouldn't fire fragmentshown

		start();

		reveal.removeEventListener( 'fragmentshown', _onEvent );
	});

	asyncTest( 'fragmenthidden event', function() {
		expect( 2 );

		var _onEvent = function( event ) {
			ok( true, 'event fired' );
		}

		reveal.addEventListener( 'fragmenthidden', _onEvent );

		reveal.slide( 2, 0, 2 );
		reveal.slide( 2, 0, 2 ); // should do nothing
		reveal.prev();
		reveal.prev();
		reveal.next(); // shouldn't fire fragmenthidden

		start();

		reveal.removeEventListener( 'fragmenthidden', _onEvent );
	});


	// ---------------------------------------------------------------
	// AUTO-SLIDE TESTS

	QUnit.module( 'Auto Sliding' );

	test( 'Reveal.isAutoSliding', function() {
		strictEqual( reveal.isAutoSliding(), false, 'false by default' );

		reveal.configure({ autoSlide: 10000 });
		strictEqual( reveal.isAutoSliding(), true, 'true after starting' );

		reveal.configure({ autoSlide: 0 });
		strictEqual( reveal.isAutoSliding(), false, 'false after setting to 0' );
	});

	test( 'Reveal.toggleAutoSlide', function() {
		reveal.configure({ autoSlide: 10000 });

		reveal.toggleAutoSlide();
		strictEqual( reveal.isAutoSliding(), false, 'false after first toggle' );
		reveal.toggleAutoSlide();
		strictEqual( reveal.isAutoSliding(), true, 'true after second toggle' );

		reveal.configure({ autoSlide: 0 });
	});

	asyncTest( 'autoslidepaused', function() {
		expect( 1 );

		var _onEvent = function( event ) {
			ok( true, 'event fired' );
		}

		reveal.addEventListener( 'autoslidepaused', _onEvent );
		reveal.configure({ autoSlide: 10000 });
		reveal.toggleAutoSlide();

		start();

		// cleanup
		reveal.configure({ autoSlide: 0 });
		reveal.removeEventListener( 'autoslidepaused', _onEvent );
	});

	asyncTest( 'autoslideresumed', function() {
		expect( 1 );

		var _onEvent = function( event ) {
			ok( true, 'event fired' );
		}

		reveal.addEventListener( 'autoslideresumed', _onEvent );
		reveal.configure({ autoSlide: 10000 });
		reveal.toggleAutoSlide();
		reveal.toggleAutoSlide();

		start();

		// cleanup
		reveal.configure({ autoSlide: 0 });
		reveal.removeEventListener( 'autoslideresumed', _onEvent );
	});


	// ---------------------------------------------------------------
	// CONFIGURATION VALUES

	QUnit.module( 'Configuration' );

	test( 'Controls', function() {
		var controlsElement = document.querySelector( '.reveal>.controls' );

		reveal.configure({ controls: false });
		equal( controlsElement.style.display, 'none', 'controls are hidden' );

		reveal.configure({ controls: true });
		equal( controlsElement.style.display, 'block', 'controls are visible' );
	});

	test( 'Progress', function() {
		var progressElement = document.querySelector( '.reveal>.progress' );

		reveal.configure({ progress: false });
		equal( progressElement.style.display, 'none', 'progress are hidden' );

		reveal.configure({ progress: true });
		equal( progressElement.style.display, 'block', 'progress are visible' );
	});

	test( 'Loop', function() {
		reveal.configure({ loop: true });

		reveal.slide( 0, 0 );

		reveal.left();
		notEqual( reveal.getIndices().h, 0, 'looped from start to end' );

		reveal.right();
		equal( reveal.getIndices().h, 0, 'looped from end to start' );

		reveal.configure({ loop: false });
	});


	// ---------------------------------------------------------------
	// LAZY-LOADING TESTS

	QUnit.module( 'Lazy-Loading' );

	test( 'img with data-src', function() {
		strictEqual( document.querySelectorAll( '.reveal section img[src]' ).length, 1, 'Image source has been set' );
	});

	test( 'background images', function() {
		var imageSource1 = reveal.getSlide( 0 ).getAttribute( 'data-background-image' );
		var imageSource2 = reveal.getSlide( 1, 0 ).getAttribute( 'data-background' );

		// check that the images are applied to the background elements
		ok( reveal.getSlideBackground( 0 ).style.backgroundImage.indexOf( imageSource1 ) !== -1, 'data-background-image worked' );
		ok( reveal.getSlideBackground( 1, 0 ).style.backgroundImage.indexOf( imageSource2 ) !== -1, 'data-background worked' );
	});


	// ---------------------------------------------------------------
	// EVENT TESTS

	QUnit.module( 'Events' );

	asyncTest( 'slidechanged', function() {
		expect( 3 );

		var _onEvent = function( event ) {
			ok( true, 'event fired' );
		}

		reveal.addEventListener( 'slidechanged', _onEvent );

		reveal.slide( 1, 0 ); // should trigger
		reveal.slide( 1, 0 ); // should do nothing
		reveal.next(); // should trigger
		reveal.slide( 3, 0 ); // should trigger
		reveal.next(); // should do nothing

		start();

		reveal.removeEventListener( 'slidechanged', _onEvent );

	});

	asyncTest( 'paused', function() {
		expect( 1 );

		var _onEvent = function( event ) {
			ok( true, 'event fired' );
		}

		reveal.addEventListener( 'paused', _onEvent );

		reveal.togglePause();
		reveal.togglePause();

		start();

		reveal.removeEventListener( 'paused', _onEvent );
	});

	asyncTest( 'resumed', function() {
		expect( 1 );

		var _onEvent = function( event ) {
			ok( true, 'event fired' );
		}

		reveal.addEventListener( 'resumed', _onEvent );

		reveal.togglePause();
		reveal.togglePause();

		start();

		reveal.removeEventListener( 'resumed', _onEvent );
	});


} );

reveal.initialize();

