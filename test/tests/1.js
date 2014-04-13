var assert = require('assert'),
	Concoct = require('../../');

describe('ConcoctJS', function() {

	var options, concoct, dummy_1, dummy_2, dummy_3;

	before(function() {

		dummy_1 = {
			name: 'dummy 1',
			handler: require('../dummyPlugins/justCall'),
			params: {
				called: false
			}
		}

		dummy_2 = {
			name: 'dummy 2',
			handler: require('../dummyPlugins/justCall'),
			params: {
				called: false
			}
		}

		dummy_3 = {
			name: 'dummy 3',
			handler: require('../dummyPlugins/justCall'),
			params: {
				called: false
			}
		}

	});

	before(function() {

		options = {
			plugins: [dummy_1, dummy_2, dummy_3]
		};

	});

	before(function() {

		concoct = new Concoct(options);

	});

	it('should call all plugged plugins', function(done) {

		concoct.concoct(function() {
			assert(dummy_1.params.called === true);
			assert(dummy_2.params.called === true);
			assert(dummy_3.params.called === true);
			done();
		});

	});

});