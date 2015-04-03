(function($) {
  $.fn.extend({
    openModal: function(options) {
      var modal = this.first();
      var overlay = $('<div class="lean-overlay"></div>');
      var windowEsc;

      modal.detach();
      $("body").append(overlay).append(modal);

      var defaults = {
        opacity: 0.5,
        in_duration: 350,
        out_duration: 250,
        ready: undefined,
        complete: undefined,
        dismissible: true
      }

      // Override defaults
      options = $.extend(defaults, options);

      if (options.dismissible) {
        overlay.click(function() {
          modal.closeModal(options);
        });

        //this function is stored in the data to allow the correct handler to be removed when dismissing the form.
        windowEsc = function(e) {
          //ensures the form is the topmost before allowing it too close.
          if (e.keyCode === 27 && $('body > .modal').filter(':visible').last().is(modal)) {   // ESC key
            modal.closeModal(options);
          }
        };

        // Return on ESC
        $(document).on('keyup.leanModal', windowEsc);
      }

      modal.find(".modal-close").on('click.leanModal', function(e) {
        modal.closeModal(options);
      });

      overlay.css({ display : "block", opacity : 0 });

      modal.css({
        display : "block",
        opacity: 0
      });

      overlay.velocity({opacity: options.opacity}, {duration: options.in_duration, queue: false, ease: "easeOutCubic"});


      // Define Bottom Sheet animation
      if (modal.hasClass('bottom-sheet')) {
        modal.velocity({bottom: "0", opacity: 1}, {
          duration: options.in_duration,
          queue: false,
          ease: "easeOutCubic",
          // Handle modal ready callback
          complete: function() {
            if (typeof(options.ready) === "function") {
              options.ready();
            }
          }
        });
      }
      else {
        modal.css({ top: "4%" });
        modal.velocity({top: "10%", opacity: 1}, {
          duration: options.in_duration,
          queue: false,
          ease: "easeOutCubic",
          // Handle modal ready callback
          complete: function() {
            if (typeof(options.ready) === "function") {
              options.ready();
            }
          }
        });
      }

      modal.data('modal', { overlay: overlay, windowEsc: windowEsc });

    },
    closeModal: function(options) {
      var defaults = {
        out_duration: 250,
        complete: undefined
      }

      var modal = this.first();
      var modalData = modal.data('modal');

      if(!modalData) return;

      var options = $.extend(defaults, options);
      var overlay = modalData.overlay;

      modal.find('.modal-close').off('click.leanModal');

      if($.isFunction(modalData.windowEsc)){
        $(document).off('keyup.leanModal', modalData.windowEsc);
      }

      overlay.velocity( { opacity: 0}, {duration: options.out_duration, queue: false, ease: "easeOutQuart"});

      // Define Bottom Sheet animation
      if (modal.hasClass('bottom-sheet')) {
        modal.velocity({bottom: "-100%", opacity: 0}, {
          duration: options.out_duration,
          queue: false,
          ease: "easeOutCubic",
          // Handle modal ready callback
          complete: function() {
            overlay.css({display:"none"});

            // Call complete callback
            if (typeof(options.complete) === "function") {
              options.complete();
            }
            overlay.remove();
          }
        });
      }
      else {
        modal.fadeOut(options.out_duration, function() {
          modal.css({ top: 0});
          overlay.css({display:"none"});

          // Call complete callback
          if (typeof(options.complete) === "function") {
            options.complete();
          }
          overlay.remove();
        });
      }

      modal.data('modal', null);

    },
    leanModal: function(options) {
      return this.each(function() {
        // Close Handlers
        $(this).click(function(e) {
          var modal_id = $(this).attr("href") || '#' + $(this).data('target');
          $(modal_id).openModal(options);
          e.preventDefault();
        }); // done set on click
      }); // done return
    }
  });
})(jQuery);
