describe("Pagination widget", function() {
	describe("basic widget initialization", function() {
		beforeEach(function() {
			var $pageTop = $("<div></div>", {  "class": "topBar" });
			$("body").append($pageTop);
		});

		afterEach(function() {
			$(".topBar").remove();
		});

		it("Pagination container should exist", function() {
			var $container = $(".topBar");
			expect($container.size()).toEqual(1);
		});

		it("expect pagination widget to have been called", function() {
			var $container 	= $(".topBar"),
				mySpy 		= sinon.spy(jQuery.fn, "pagination");

				$container.pagination();
				expect(mySpy).toHaveBeenCalled();

				jQuery.fn.pagination.restore();
		});

		it("container should have the pagination div as a child", function() {
			var $container = $(".topBar");
			$container.pagination();

			expect($container.find("div").size()).toEqual(1);

			expect( $(".pagination") ).toExist();
		});

		it("expect the div to have a class of pagination by default", function() {
			var $c = $(".topBar");
			$c.pagination();

			expect($c.find("div")).toHaveClass("pagination");
		});

		xit("expect pagination to be hidden if page number is 0 and noPagesHide Set to true ", function() {
			var $c = $('.topBar');

			$c.pagination();

			expect($c).not.toHaveHtml("<div class='pagination'><ul></ul></div>");
		});

		it("expect pagination to be hidden if page number is 1 and noPagesHide Set to true ", function() {
			var $c = $('.topBar');

			$c.pagination({ pageCount: 1 });

			expect($c).not.toHaveHtml("<div class='pagination'><ul></ul></div>");
		});

		it("expect pagination to be visible if page number is 0 and noPagesHide Set to false ", function() {
			var $c = $('.topBar');

			$c.pagination({
				hideEmpty: false,
				pageCount: 0
			});

			expect($c).toHaveHtml("<div class='pagination'><ul></ul></div>");
		});

		it("expect pagination to be visible if page number is 1 and noPagesHide Set to false ", function() {
			var $c = $('.topBar');

			$c.pagination({
				hideEmpty: false,
				pageCount: 1
			});

			expect($c).toHaveHtml("<div class='pagination'><ul></ul></div>");
		});

		it("number of li item should equal number of pagecount", function() {
			var $c = $(".topBar"),
				$pagination = "";

			$c.pagination({ pageCount: 5 });

			$pagination = $c.find("ul");
			expect($pagination).toExist();

			// make sure that number of list items it equal to 5 + 2 for nav but we exclute that
			expect($pagination.find("li").size()).toEqual(7)
		});

		it("if current page is not provided should default to 1", function() {
			var $c = $(".topBar")

				$c.pagination({ pageCount: 30 });

				expect( $c.pagination("option","currentPage") ).toEqual(1);
		});
		it("should not allow user to set current page to 0 or less than 0", function() {
			var $c = $(".topBar"),
				$pagination = "";

				$c.pagination({ pageCount: 30, currentPage: 0 });

				$pagination = $c.find("ul");

				expect( $c.pagination("option","currentPage") ).toEqual(1);
		});

		it("Make sure that the active page has a class of active", function() {
			var $c = $(".topBar"),
				$pagination = "";

				$c.pagination({ pageCount: 10 });

				$pagination = $c.find("ul");
				expect($pagination).toExist();
				expect( $pagination.find("li[data-page='1']") ).toHaveClass("active");
		});

		it("Make sure that the prev button is disabled if current page is 1", function() {
			var $c = $(".topBar"),
				$pagination = "";

				$c.pagination({ pageCount: 10 });
				expect( $c.pagination("option","currentPage") ).toEqual(1);
				expect( $("ul", $c).find("li[data-role='prev-btn']")).toHaveClass("disabled");
		});

		xit("Prev button should handle click event", function() {
			var $c = $(".topBar"),
				$pagination = "";

				$c.pagination({ pageCount: 10 });
				expect( $c.pagination("option","currentPage") ).toEqual(1);

				expect( $("ul", $c).find("li[data-role='prev-btn']")).toHandle("click");
		});

		xit("Next Button should handle click event", function() {
			var $c = $(".topBar"),
				$pagination = "";

				$c.pagination({ pageCount: 10 });
				expect( $c.pagination("option","currentPage") ).toEqual(1);

				expect( $("ul", $c).find("li[data-role='next-btn']")).toHandle("click");
		});

		it("Initializing plugin with current page 5 should set option currentPage to 5", function() {
			var $c = $(".topBar");

					$c.pagination({ pageCount: 20, currentPage: 5});

					expect($c.pagination("option", "currentPage")).toEqual(5);
		});

		it("isFirstPage should return true if page is set to first page", function() {
			var $c = $(".topBar"),
				isFirstPage;

			$c.pagination({ pageCount: 20, currentPage: 1 });
			isFirstPage = $c.data("pagination")._isFirstPage();
			expect($c.pagination("option", "currentPage")).toEqual(1);
			expect(isFirstPage).toEqual(true);
		});
		it("isFirstPage should return true if page is set to 0 and current page should be set to 1", function() {
			var $c = $(".topBar"),
				isFirstPage;

			$c.pagination({ pageCount: 20, currentPage: 0 });
			isFirstPage = $c.data("pagination")._isFirstPage();
			expect(isFirstPage).toEqual(true);
			expect($c.pagination("option", "currentPage")).toEqual(1);
		});
		it("isFirstPage should return true if page is set to -1 and current page should be set to 1", function() {
			var $c = $(".topBar"),
				isFirstPage;

			$c.pagination({ pageCount: 20, currentPage: -1 });
			isFirstPage = $c.data("pagination")._isFirstPage();
			expect(isFirstPage).toEqual(true);
			expect($c.pagination("option", "currentPage")).toEqual(1);
		});
		it("isFirstPage should return true if page is set to abc and current page should be set to 1", function() {
			var $c = $(".topBar"),
				isFirstPage;

			$c.pagination({ pageCount: 20, currentPage: "abc" });
			isFirstPage = $c.data("pagination")._isFirstPage();
			expect(isFirstPage).toEqual(true);
			expect($c.pagination("option", "currentPage")).toEqual(1);
		});
		describe("Pagination Widgets", function() {
			it("Create event should be triggered on initialization", function() {
				var $c = $(".topBar"),
					$pagination = "",
					mySpy 		= sinon.spy(jQuery.fn, "pagination");


					$c.pagination({ pageCount: 10 });
					expect( $c.pagination("option","currentPage") ).toEqual(1);

					$c.bind("paginationcreate", mySpy);

					expect(mySpy).toHaveBeenCalled();

					jQuery.fn.pagination.restore();
			});
		});

		describe("Pagination with Connected Controls eg. Top and bottom page navigation", function() {
			it("connectWith options should point to HTML element", function() {
				var $c = $(".topBar");

				$c.pagination({pageCount: 20, connectWith: ".topbarBottom"});

				expect( $c.pagination("option", "connectWith") ).not.toEqual(null);
			});
		});
	});
});