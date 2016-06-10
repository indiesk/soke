/* ========================================================================
 * SOKE: tracker.js v1.0.0
 * http://soke.it/javascript/#tracker
 * ========================================================================
 * Copyright 2016 SOKE.
 * Licensed under MIT (https://github.com/indiesk/soke/blob/master/LICENSE)
 * ======================================================================== */

// IIFE (Imediately Invoked Function Expression)
// Alternatively,
// (function(){
//     // Codes
// }());

+function(){
    'use strict';

    // TRACKER CLASS DEFINITION
    // ========================

    var Tracker = function (element, options) {
        this.$element       = $(element)
        this.$items         = $(element).children("div.tracker-item")
        this.groups         = $('<div>',{'class':'soke-tracker-groups'})
        this.options        = options
        this.currentIndex   = options.beginAt || 0

        this.$indicators    = options.style == 'slideshow' ? $("<div>",{"class":"tracker-indicators"}) : null

        this.required       = false
        this.filled         = false

        this.init(element, options)
    }

    Tracker.VERSION = '1.0.0';

    Tracker.DEFAULTS = {
        // Default Options
        style:          'list',
                        // Style in which the tracker items are presented
                        // 'slideshow' or 'list'
        progress:       true,
                        // If true, show and update progress by a circular bar graph after each item
        visualization:  'radar'
                        // Type of visualization of the final result
                        // 'radar' or 'bar'
    }

    Tracker.prototype = {
        init: function (element, options) {
            var that = this
            this.$items.each(function (idx) {
                var $item = $(this)

                // Create BS input-group and input-group-addon for an icon if there is any
                var $inputGroup = $("<div>",{"class":"input-group"})
                var $icon = $("<span>",{"class":"input-group-addon icon"}).append(
                    $("<img />",{"src":$item.data('icon') || ''})
                )
                $inputGroup.append($icon)

                // Create input fields
                if ($item.data('type') == 'slider') {
                    // Create label for input name
                    $inputGroup.append($('<span>',{'class':'input-group-addon name'}).html($item.data('name')))

                    var $input = $('<input>',{'class':'form-control','type':'range','min':$item.data('min'),'max':$item.data('max')})
                    $inputGroup.append($input)
                }
                if ($item.data('type') == 'button' && typeof $item.data('min') == 'number' && typeof $item.data('max') == 'number') {
                    // Create label for input name
                    $inputGroup.append($('<span>',{'class':'form-control name'}).html($item.data('name')))

                    // Create buttons according to the min and max data, and append them into input-group
                    var $buttonGroup = $("<span>",{'class':'input-group-btn'})
                    for ( var i=$item.data('min'); i<=$item.data('max'); i++ ) {
                        var $button = $buttonGroup.append(
                            $('<button>',{'class':'btn btn-default','type':'button'}).html(i)
                        )
                    }
                    $inputGroup.append($buttonGroup)
                }

                // Create a group or extend inside the group if a group is specified
                // Otherwise, create a tentative group using its index
                var group = $item.data('group') || idx
                console.log(that.groups.children('.'+group))
                if ( that.groups.children('.'+group).length > 0 ) {
                    that.groups.children('.'+group).append($inputGroup)
                } else {
                    var $group = $("<div>",{'class':'group '+group})
                    var groupTitle = $('.tracker-group[data-name='+group+']').data('title')
                    var groupDescription = $('.tracker-group[data-name='+group+']').data('description')
                    $group.append(
                        $('<div>',{'class':'group-title'}).html(groupTitle)
                    ).append(
                        $('<div>',{'class':'group-description'}).html(groupDescription)
                    ).append($inputGroup)
                    that.groups.append($group)
                }
            })

            this.$element.append(that.groups)

        },
        getItemIndex: function (item) {
            return this.$items.index(item)
        },
        next: function () {
            if (this.required && !this.filled) return
            this.currentIndex++
            if ( this.currentIndex > this.$items.length-1 ) this.currentIndex = 0
            return this.to(this.currentIndex)
        },
        prev: function () {
            if (this.required && !this.filled) return
            this.currentIndex--
            if ( this.currentIndex < 0 ) this.currentIndex = this.$items.length - 1
            return this.to(this.currentIndex)
        },
        to: function (idx) {
            var that = this
            this.$items.animate({
                opacity:0
            },Tracker.ANIMATION_DURATION)
            setTimeout(function() {
                that.$items.eq(idx).animate({
                    opacity:1
                },Tracker.ANIMATION_DURATION)
            },Tracker.ANIMATION_DURATION)
            return this
        },
        updateProgress: function () {

        },
        updateData: function () {

        },
        visualize: function () {
            if (this.options.visualization == 'bar') {

            } else { // 'radar'

            }

        }
    }

    // TRACKER PLUGIN DEFINITION
    // =========================

    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data('soke.tracker')
            var options = $.extend({}, Tracker.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('soke.tracker', (data = new Tracker(this, options)))
        })
    }

    var old = $.fn.tracker

    $.fn.tracker             = Plugin
    $.fn.tracker.Constructor = Tracker


    // TRACKER NO CONFLICT
    // ===================

    $.fn.tracker.noConflict = function () {
        $.fn.tracker = old
        return this
    }


    $(window).on('load', function () {
        $('[data-ride="tracker"]').each(function () {
            var $tracker = $(this)
            Plugin.call($tracker, $tracker.data())
        })
    })

}(jQuery);
