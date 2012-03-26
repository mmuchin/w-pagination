describe("Using sinon spy", function() {
	describe("Spying on ajax", function() {
		beforeEach(function() {
			sinon.spy(jQuery, 'ajax')
		});

		afterEach(function() {
			jQuery.ajax.restore(); // Unwrap the spy
		});

		it("Should inspect jQuery.getJSON's usage of jQuery.ajax", function() {
			$.getJSON("/some/resources")/
			expect(jQuery.ajax).toHaveBeenCalled();
			expect(jQuery.ajax.getCall(0).args[0].dataType).toEqual("json");
		});
	});

	describe("More spy functionality ", function() {
		it("test should call method once with each argument", function() {
			var obj = { method: function() {} };
			var spy = sinon.spy(obj, "method");
			spy.withArgs(42);
			spy.withArgs(1);


			obj.method(42);
			obj.method(1);
			obj.method(19);

			expect(spy.withArgs(42)).toHaveBeenCalled();
			expect(spy.withArgs(1).calledOnce).toBeTruthy();
			expect(spy.callCount).toEqual(3);
			expect(spy.neverCalledWith(10)).toBeTruthy();
		});
	});
	describe("faking clock and timouts", function() {
		beforeEach(function() {
			this.clock = sinon.useFakeTimers();
		});

		afterEach(function() {
			this.clock.restore();
		});

		it("should animate element over 500ms", function() {
			var el = $("<div></div>");
			el.appendTo(document.body);

			el.animate({ height: "200", width: "200px"});
			this.clock.tick(500);

			expect("200px").toEqual( el.css("width") );
			expect("200px").toEqual( el.css("height"))
		});
	});


});