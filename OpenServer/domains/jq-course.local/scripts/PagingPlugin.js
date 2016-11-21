(function ($, window, document, undefined){
    
    //ctor and prototype
    var pagination=$.fn.customPagination;

    var CustomPagination=function(element,options){
        this.$element = $(element);
        this.options = $.extend({}, $.fn.customPagination.defaults, options);

        this.checkNavAccess();
    };

    CustomPagination.prototype={
        constructor:CustomPagination,

        destroy: function(){
            this.$element.empty();
            this.$element.removeData('custom-pagination');

            return this;
        },

        //checks if there is a point in allowing to press "next" or "prev"
        checkNavAccess:function(){
            if(this.options.activePage>=this.options.totalPages){
                this.options.nextBt.prop('disabled',true);
            } else{
                this.options.nextBt.prop('disabled',false);
            }

            if(this.options.activePage<=1){
                this.options.prevBt.prop('disabled',true);
            } else{
                this.options.prevBt.prop('disabled',false);
            }
        },

        changePage:function(){
            window.location.replace('#'+this.options.activePage)

            this.options.numSpan.text('Page '+this.options.activePage);

            this.$element.empty();
            this.options.appendDataFunc();
            this.checkNavAccess();
        },
        
        next:function(){
            this.options.activePage++;

            this.changePage();
        },

        prev:function(){
            this.options.activePage--;

            this.changePage();
        },

        getPage:function(){
            return this.options.activePage;
        }
    };


    $.fn.customPagination=function(option){
        var args = Array.prototype.slice.call(arguments, 1);
        var methodReturn;

        var $this = $(this);

        var data = $this.data('custom-pagination');
        var options = typeof option === 'object' ? option : {};

        if (!data) $this.data('custom-pagination', (data = new CustomPagination(this, options) ));
        if (typeof option === 'string') methodReturn = data[ option ].apply(data, args);

        return ( methodReturn === undefined ) ? $this : methodReturn;
    };

    $.fn.customPagination.defaults={
        totalPages:1,
        perPage:7,
        nextBt:$('#next'),
        prevBt:$('#prev'),
        numSpan:$('#numSpan'),
        activePage:1,
        appendDataFunc:null
    };

    $.fn.customPagination.Constructor=CustomPagination;

    $.fn.customPagination.noConflict=function(){
        $.fn.customPagination=pagination;
        return this;
    };

})(window.jQuery, window, document);