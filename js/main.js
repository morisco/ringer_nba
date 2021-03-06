$(document).ready(function(){
    var masterList = new CardList();
    var mobile = new Mobile(masterList);

});

function CardList() {
    var cardlist = this;

    this.$el = $('#item-list');

    this.templateSource = $("#player-card-template").html();
    this.template = Handlebars.compile(this.templateSource);

    this.coverageTemplateSource = $("#coverage-template").html();
    this.coverage_template = Handlebars.compile(this.coverageTemplateSource);

    this.cards = [];

    this.sort_id = GLOBALS.current_sort;
    this.filter_id = 'all';

    this.initial_player = GLOBALS.player || false;

    this.filterOffsetPos = $('#content').offset().top + parseInt($('#content').css('padding-top'), 10);

    this.introOffsetPos = $('#intro').offset().top;

    this.size = 'medium';
    this.cards = [];

    this.init = function() {
        // this.windowResize();
        this.initEvents();
        this.scrollWatch();
        if(this.initial_player){
            cardlist.openPlayer();
        }
        this.initCards();
    }

    this.initCards = function(){
        var playerCard;
        var playerCount = 0;
        _.each(GLOBALS.list[cardlist.sort_id], function(player, index){
            var id = player.filter_id;
            player = _.findWhere(GLOBALS.data.players, { filter_id: id});
            if(player){
                playerCount++;
                playerCard = new Card(playerCount, player);
                cardlist.cards.push(playerCard);
            } else{
                console.log('missing player', id);
            }
        });
    }


    this.initEvents = function() {
        $('#filters').on('click', 'a', this.filter);
        $('#filter-bar').on('click', '.filter:not(.active_filter)', this.sort);
        $('.size-toggle').on('click', 'li', this.changeSize);
        $('.size-toggle').on('mouseenter', 'li', this.previewSize);
        $('.size-toggle').on('mouseleave', 'li', this.revertSize);
        $(window).on( "orientationchange", this.orientationChange );

        // $(window).on('resize', this.windowResize);
        if(!GLOBALS.player){
            $(window).on('scroll', cardlist.scrollWatch);
        }
    }

    this.orientationChange = function(){
        setTimeout(function(){
            cardlist.filterOffsetPos = $('#content').offset().top;
        }, 500);
    };

    this.previewSize = function(){
        cardlist.size_preview = $(this).data('size');
        $('.size-indicator').attr('class', 'size-indicator').addClass(cardlist.size_preview);
    };

    this.revertSize = function(){
        $('.size-indicator').attr('class', 'size-indicator').addClass(cardlist.size);
    };


    this.windowResize = function(){
        var windowWidth = $(window).width();
        clearTimeout(cardlist.sizeTimeout);
        cardlist.sizeTimeout = setTimeout(function(){
            windowWidth = $(window).width();
            cardlist.filterOffsetPos = $('#content').offset().top + parseInt($('#content').css('padding-top'), 10);
        },250);
        // $('.card-item:not(.large)').removeClass('small medium').addClass(cardlist.size);
        if(windowWidth < 1100 && windowWidth > 767 ){
            $('body').removeClass('mobile');
            $('body').addClass('tablet no-transition');
        } else if(windowWidth < 768){
            $('body').removeClass('tablet');
            $('body').addClass('mobile no-transition');
        } else {
            $('body').addClass('no-transition');
            $('body').removeClass('tablet mobile');
        }
        setTimeout(function(){
            $('body').removeClass('no-transition');
        },100);
    };

    this.openPlayer = function() {
        var timeout = false,
            openCard = $('.card-item[data-id="' + GLOBALS.player + '"]'),
            openScrollPos = openCard.offset().top,
            scrollOffset = $(window).width() < 768 ? $('#mobile-nav').height() + 40 : 100,
            delay = $(window).width() < 768 ? 500 : 0;

        setTimeout(function(){
            $('body,html').animate({scrollTop: openScrollPos - scrollOffset}, function(){
                $('body').addClass('filter-fixed');
                clearTimeout(timeout);
                timeout = setTimeout(function(){
                    events.publish('card.expanded', {id: GLOBALS.player})
                    $(window).on('scroll.scrollWatch', cardlist.scrollWatch);
                },100);
            });
        }, delay);

    }

    this.changeSize = function(e, size){
        e.preventDefault();
        var transitionClass;
        cardlist.old_size = cardlist.size;
        cardlist.size = size || $(this).data('size');
        events.publish('size.update', {size: cardlist.size});
        transitionClass = cardlist.old_size + '-to-' + cardlist.size;
        $('.size-indicator').attr('class', 'size-indicator').addClass(cardlist.size);
        $('.size-toggle .active').removeClass('active background-theme');
        $(this).addClass('active background-theme');
        $('body').removeClass('small medium large').addClass(cardlist.size + ' ' + transitionClass);
    };

    this.scrollWatch = function() {
        var scrollPos = $(window).scrollTop();
        if(scrollPos > cardlist.filterOffsetPos){
            $('body').addClass('filter-fixed');
        } else {
            $('body').removeClass('filter-fixed');
        }

        if(scrollPos > cardlist.introOffsetPos && $('.heading-wrapper:visible') && $(window).width() > 767){
            $('.heading-wrapper').hide();
        } else if(scrollPos <= cardlist.introOffsetPos && $('.heading-wrapper:hidden') && $(window).width() > 767) {
            $('.heading-wrapper').show();
        }
    }

    this.setColors = function() {
        var color = GLOBALS.theme_colors[cardlist.sort_id];
        $('body').removeClass('ringer kevin danny jonathan az');
        $('body').addClass(cardlist.sort_id);
        $('.arrow-fill').attr('style', 'fill:' + color + ';');
    }

    this.sort = function(e){
        e.preventDefault();
        e.stopPropagation();
        if(cardlist.sort_id  == $(e.currentTarget).data('sort-id')){
            return;
        }

        var player,
            coverage_count = 5;
        $('body').addClass('rebuilding');
        $('.active_filter').removeClass('active_filter');
        $(e.currentTarget).addClass('active_filter');
        cardlist.sort_id = $(e.currentTarget).data('sort-id');
        cardlist.setColors();
        cardlist.buildList(GLOBALS.data.players);
        events.publish('sort.update', {sort: cardlist.sort_id});
    }

    this.filter = function(e){

        cardlist.filter_id = $(e.currentTarget).data('filter');

        $('#filters a.active, #mobile-nav .nav-filter a').removeClass('active color-theme');
        $(e.currentTarget).addClass('active color-theme');

        if($(window).scrollTop() > cardlist.filterOffsetPos){
            if($(window).width() < 767){
                $('html,body').scrollTop((cardlist.filterOffsetPos + 1));
            } else {
                $('body,html').animate({scrollTop:cardlist.filterOffsetPos+1});
            }
        }

        if(cardlist.filter_id === 'all'){
            cardlist.$el.removeClass('filtered big guard forward');
        } else {
            cardlist.$el.removeClass('big guard forward');
            cardlist.$el.addClass('filtered ' + cardlist.filter_id);
        }

        // events.publish('filter.update', { filter: cardlist.filter_id });
    }

    this.buildList = function() {
        var playerCount = 0;
        if($(window).width() < 767){
            $('html,body').scrollTop((cardlist.filterOffsetPos + 1));
        } else {
            $('html,body').animate({scrollTop: (cardlist.filterOffsetPos + 1)})
        }
        _.each(GLOBALS.list[cardlist.sort_id], function(player, index){
            player = _.findWhere(GLOBALS.data.players, { filter_id: player.filter_id});
            if(player){
                if(cardlist.cards[index]){
                    playerCount++;
                    cardlist.cards[index].update(player);
                }
            }
        });
        setTimeout(function(){
            $('body').removeClass('rebuilding');
        },1000);
    }

    this.init();

    return cardlist;
}
