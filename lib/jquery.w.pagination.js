(function($) {
	$.widget("w.pagination", {
		options: {
			containerClass 	: "pagination",
			pageCount 		: 0,
			currentPage		: 1,
			pageLimit		: 4, // How many page number you wish to display to the left and right sides of the current page
			limitPaging		: true,
			activeClass		: "active",
			disabledClass 	: "disabled",
			previousBtn		: "&larr; Previous",
			nextBtn 		: "Next &rarr;", 
			hideEmpty	 	: true,
			conected		: false,
			connectWith		: null // Pass id or class to append pagination
		},
		_create: function() {
			var self 	= this,
				o 		= self.options,
				$el 	= self.element;

			self.container 	= $("<div></div>", { "class" : o.containerClass });
			self.paging 	= $("<ul></ul>");
			self.divider	= "<li class='disabled'><a href='#'>...</a></li>";
			self.totalPages = o.pageCount;

			// Run calculation for pagination
			self.buildPagination();

			// build pagination wrapper 
			self.container.html(self.paging);
			// Set Active Page
			self.setNewPage( o.currentPage );

			$el.on("click", "li[data-role='paging']", $.proxy(this.setNewPage, this));

			// Add click handlers to directional navigation
			$el.on("click", "li[data-role='prev-btn'], li[data-role='next-btn']", $.proxy( self.directionalNav, this));

			// after all calculaton add pagination to the page
				$el.html(self.container);

			if ( o.connectWith != null && $(o.connectWith).size() > 0) {
				self.connectedControls();
			}
			// Add click handler to all list items
			/*MM $(this.element).on("click", "li[data-role='paging']", $.proxy(function( e ) {
				e.preventDefault();
				var pageNumber = $(e.currentTarget).attr("data-page");

				this.setNewPage( pageNumber );
			}, this));
			MM */
		},
		directionalNav: function( e ) {
			var self = this;
			e && e.preventDefault();
			// Do not act if current element has a disabled class
				if( $(e.currentTarget).hasClass("disabled")) { return; }

				// Determine the cation we need to perform based on the button clicked
				switch($(e.currentTarget).attr("data-role")) {
					case "prev-btn":
						self.goToPrevPage();
					break;
					case "next-btn":
						self.goToNextPage();
					break;
				}
		},
		_init: function() {
			var self 	= this,
				o 	 	= self.options,
				el 		= self.element;

			// Check for option
			self._hideEmpty();
			console.log("init called");
			console.log("page count is ", o.pageCount);
		},
		_hideEmpty: function() {
			var self 	= this,
				o 		= self.options,
				el 		= self.element;

				if ( o.hideEmpty && ( o.pageCount < 2 )) {
					this.container.hide();
				} else {
					this.container.show();
				}
		},
		buildPagination: function() {
			var self 		= this,
				o 			= self.options,
				el 			= self.element,
				pageCount 	= parseInt(o.pageCount, 10),
				pagingStr 	= "";
				
				// Remove all elements before adding a new set useful for updating page count
				self.paging.empty();

				// Do not build pagint if page count is less than 2.
				if ( pageCount < 2 ) { return; }
				
				// If page count is greater than 1 the we build paging
				for(var i = 1; i <= pageCount; i++) {
					pagingStr += "<li data-page=" + i + " data-role='paging'><a href='#page-" + i + "'>"+ i +"</a></li>";
				}

				self.paging.append(pagingStr);
				self.paging.prepend(self.arrowPrev());
				self.paging.append(self.arrowNext());
		},
		arrowPrev: function() {
			var self = this,
				o 	 = self.options
				prevEl 	= "<li data-role='prev-btn'><a href='#prev-btn'>" + o.previousBtn + "</a></li>";

				return prevEl;
		},
		arrowNext: function() {
			var self 	= this,
				o 		= self.options
				nextEl 	= "<li data-role='next-btn'><a href='#next-btn'>" + o.nextBtn + "</a></li>";

				return nextEl;
		},
		_isFirstPage: function() {
			return this.options.currentPage === 1;
		},
		_isLastPage: function() {
			return this.options.currentPage === parseInt(this.options.pageCount, 10);
		},
		_disableLastAndFirst: function() {
			var self 	= this,
				o 		= self.options,
				el 		= self.element;

			$("li[data-role='prev-btn']", self.container)[ (self._isFirstPage() ? "add" : "remove") + "Class" ]('disabled');
			$("li[data-role='next-btn']", self.container)[ (self._isLastPage() ? "add" : "remove") + "Class" ]('disabled');

			if ( o.connectWith != null && $(o.connectWith).size() > 0) {
				$("li[data-role='prev-btn']", $(o.connectWith))[ (self._isFirstPage() ? "add" : "remove") + "Class" ]('disabled');
				$("li[data-role='next-btn']", $(o.connectWith))[ (self._isLastPage() ? "add" : "remove") + "Class" ]('disabled');
			}
		},
		goToPrevPage: function() {
			var self 			= this,
				o 				= self.options,
				el 				= self.element,
				currentPage 	= o.currentPage;

				if ( currentPage > o.pageCount ) {
					currentPage = o.pageCount;
				}
				this.setNewPage(currentPage - 1);
		},
		goToNextPage: function() {
			var self 	= this,
				o 		= self.options,
				el 		= self.element,
				currentPage 	= o.currentPage;
				if ( currentPage < 1 ) {
					currentPage = 1;
				}
				self.setNewPage(currentPage + 1);
		},
		setNewPage: function( page ) {

			var self 		= this,
				o 			= self.options,
				oldValue 	= o.currentPage,
				newPage 	= isNaN(page) ? 1 : parseInt(page, 10 );

				
			if (arguments.length === 1 && !$.isEmptyObject(arguments[0]) && arguments[0].currentTarget) {
				var newPage = self.getPageNumber(arguments[0]);
			}

			switch( true ) {
				case (newPage < 1):
					newPage = 1;
					break;
				case (newPage > o.pageCount):
					newPage = o.pageCount;
					break;
				default: 
					newPage = newPage;
					break;
			}

			o.currentPage = newPage;

			// After changing the page set active page
			self.setActivePage();
		},
		setActivePage: function(e) {
			var self 	= this,
				o 		= self.options,
				$el 	= self.element,
				oldValue = o.currentPage;

				self._limitPaging();
				
				// check if this is a first or last page and disable the next or prev arrow
				self._disableLastAndFirst();

				// Remove active from all pages before change
				$("li[data-role='paging']", self.container).removeClass("active");

				// Add Active class to the current page
				$("li[data-page='" + o.currentPage + "']", self.container).addClass(this.widgetBaseClass+"-active active");

				if ( o.connectWith != null && $(o.connectWith).size() > 0) {
					self.createConnected();
				}
				// Trigger page change
			self._trigger("pageChange", { type: "pageChange" }, { newPage: o.currentPage, oldPage: oldValue, pageTotal: o.pageCount });
		},
		createConnected: function() {
			var self 	= this,
				o 		= self.options;

			var clone = $(self.container).clone();
				console.log("cloine is ", clone);
				$(o.connectWith).html( clone );
		},
		getPageNumber: function( e ) {
			if (!e || !e.currentTarget ) { return; }

			var pageNumber = parseInt( $(e.currentTarget).attr("data-page"), 10);
			return pageNumber;
		},
		// Handle connected pagination
		connectedControls: function() {
			var self 		= this,
				o 			= self.options,
				clone 		= $(self.container).clone(),
				pageNumber;

				// Add Controls to connected navigation
				$(o.connectWith).on("click", "li[data-role='prev-btn'], li[data-role='next-btn']", $.proxy( self.directionalNav, self));

				$(o.connectWith).html( clone );

				$(o.connectWith).on("click", "li[data-role='paging']", $.proxy(function( e ) {
					e && e.preventDefault();

					pageNumber = $(e.currentTarget).attr("data-page");

					self.setNewPage( pageNumber );
				}, self));
		},
		_setOption: function(key, value) {
			var oldValue = this.options[key];

			// Check for a particular option being set
			if (key == "currentPage") {
				this.setNewPage( value );
			}

			if( key === "limitPaging" ) {
				this.options.limitPaging = value;
				this._limitPaging();
			}
			if( key === "hideEmpty" ) {
				this.options.hideEmpty = value;
				this._hideEmpty();
			}
			if(key === "pageCount") {
				this.options.pageCount = value;
				this.buildPagination();
				this.setNewPage( this.options.currentPage);
				this._hideEmpty();
			}
			// Call the base _setOption method
			$.Widget.prototype._setOption.apply(this, arguments);

			// The widget factory doesn't fire an callback for options changes by default
			// In order to allow the user to respond, fire our own callback
			this._trigger("setOption", { type: "setOption" }, {
				option: key,
				original: oldValue,
				current: value
			});
		},
		_pagingStart: function() {
			var self 	= this,
				o 		= self.options,
				start 	= 1;
				if ( o.currentPage + o.pageLimit >= o.pageCount ) {
					return start = o.pageCount - (o.pageLimit * 2) - 1 ;
				} else {
					return start = (o.currentPage - o.pageLimit) <= 0 ? 1 : o.currentPage - o.pageLimit;
				}
		},
		_pagingEnd: function() {
			var self 	= this,
				o 		= self.options,
				end 	= 1,
				minPages = (o.pageLimit * 2) + 2;

				// check if current page is less than 
				if( (o.currentPage + o.pageLimit ) <= minPages ) {
					end = minPages;
				}  else {
					end = (o.currentPage + o.pageLimit) >= o.pageCount ? o.pageCount : o.currentPage + o.pageLimit;
				}

				return end;
		},
		_limitPaging: function() {
			var self = this,
				$el  = self.element,
				o 	= self.options
				indexStart = self._pagingStart(),
    			indexEnd = self._pagingEnd(),
    			visibleStart = o.currentPage - indexStart,
    			visibleEnd =  indexEnd - o.currentPage;

    			// Do not slice if page count is less than 10
				if ( o.pageCount < 10 ) { return; }

			if(o.limitPaging) {
				var $paging = $("li[data-role='paging']", self.container).hide();
					$paging.slice(indexStart, indexEnd).show();

				//	self.container.find("li[data-role='paging'][data-page='1']").show();
					$paging.filter("[data-page='1']").show();
					self.container.find("li[data-role='paging'][data-page='" + o.pageCount + "']").show();

					if(indexStart >= 2) {
						if ( self.container.find(".first").size() < 1 ) {
							self.container.find("li[data-role='paging'][data-page='1']").after($(this.divider).addClass("first"));
						}
					} else {
						self.container.find(".first").remove();
					}

					if( indexEnd < o.pageCount) {
						if ( self.container.find(".last").size() < 1 ) {
							self.container.find("li[data-role='paging'][data-page='" + o.pageCount + "']").before($(this.divider).addClass("last"));
						}
					} else {
						self.container.find(".last").remove();
					}

			} else {
				// Show all pages no limit
				$("li[data-role='paging']").show();
			}
		}

	});
})(jQuery);