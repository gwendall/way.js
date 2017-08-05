var fs      = require('fs');
var assert  = require('assert');
var mocha   = require('mocha');
var sinon   = require('sinon');
var fakedom = require('fakedom-amd');

describe('way.js', function() {
    var window;
    var module;
    var clock;

    beforeEach(function() { clock = sinon.useFakeTimers(); });
    afterEach(function() { clock.restore(); });

    beforeEach(function(done) {
        var env = new fakedom(
            {
                html:           getHtml('form.html'),
                requireOptions: { baseUrl: __dirname + '/../' },
                disableConsole: true,
                module:         'way'
            },
            function(err, w, m) {
                if (err) throw err;
                window = w;
                module = m;
                fireEvent('DOMContentLoaded', window.document);
                done();
            }
        );
    });

    describe('data-binding', function() {
        context('when form name is changed', function() {
            beforeEach(function() {
                updateFormField('form-name', 'test');
            });

            it('should have populated the data-bound element', function() {
                var targetInput = window.document.getElementById('form-target');
                assert.equal(targetInput.innerHTML, 'test');
            });
        });
    });

    function updateFormField(id, value) {
        var element = window.document.getElementById(id);
        element.value = value;
        fireEvent('change', element);
        clock.tick(1);
    }

    function fireEvent(type, element) {
        var event = window.document.createEvent('HTMLEvents')
        event.initEvent(type, true, true, window, 1)
        element.dispatchEvent(event);
    }

    function getHtml(file) {
        return fs.readFileSync(__dirname + '/fixture/' + file, 'utf8');
    }
});
