function Card(e,t){var i=this;return this.data=t,this.id=e,this.el=$('.card-item[data-id="'+this.data.filter_id+'"]'),this.size="medium",this.sort=GLOBALS.current_sort,this.infoTemplateSource=$("#info-template").html(),this.infoTemplate=Handlebars.compile(this.infoTemplateSource),this.coverageTemplateSource=$("#related-coverage-template").html(),this.coverageTemplate=Handlebars.compile(this.coverageTemplateSource),this.init=function(){this.initEvents(),i.data.coverage=$.map(i.data.coverage,function(e,t){return[e]})},this.initEvents=function(){this.el.on("click.whole",this.toggleWholeCard),this.el.on("click.gifs",this.loadGifs),this.el.on("mouseenter",this.showColor),this.el.on("mouseenter",this.expandedLoadGifs),this.el.on("mouseleave",this.hideColor),this.el.on("mouseenter",".has-media",this.showMedia),this.el.on("tap",".has-media",this.showMedia),this.el.on("mouseleave",".has-media",this.hideMedia),this.el.on("click",".toggle-card",this.toggleCard),events.subscribe("filter.update",this.filter),events.subscribe("sort.update",this.sortChange),events.subscribe("size.update",this.size),events.subscribe("card.expanded",this.openPlayer)},this.openPlayer=function(e){e.id===i.data.filter_id&&(i.el.off("click.whole"),i.el.off("click.gifs"),i.toggleCard())},this.expandedLoadGifs=function(){"large"!==i.size||i.loaded||i.loadGifs()},this.toggleCard=function(e){i.el.toggleClass("expanded-card"),i.el.hasClass("expanded-card")?(i.el.off("click.whole"),i.el.off("click.gifs"),i.hideColor()):i.el.on("click.whole",i.toggleWholeCard)},this.toggleWholeCard=function(){"large"===i.size||i.el.hasClass("expanded-card")||(i.el.off("click.whole"),i.el.addClass("expanded-card"),i.hideColor())},this.showColor=function(){i.el.hasClass("expanded-card")||!$("body").hasClass("small")&&!$("body").hasClass("medium")||(i.el.find(".info-column").attr("style","color:"+GLOBALS.theme_colors[i.sort]+";"),i.el.find(".info-column .player-description, .info-column span.title, .info-column .stat-wrap").attr("style","border-color:"+GLOBALS.theme_colors[i.sort]+"!important;"),i.el.find(".rank-column .rank").attr("style","color:"+GLOBALS.theme_colors[i.sort]+"!important; background-color:transparent !important;"),i.el.find(".rank-column").attr("style","background-color:transparent !important; background-image:url(img/dots.png); background-size:20%; border-right:1px solid #ccc;"))},this.hideColor=function(){i.el.find(".info-column").removeAttr("style"),i.el.find(".info-column .stat-wrap").removeAttr("style"),i.el.find(".info-column .player-description").removeAttr("style"),i.el.find(".info-column span.title").removeAttr("style"),i.el.find(".rank-column .rank").removeAttr("style"),i.el.find(".rank-column").removeAttr("style")},this.showMedia=function(){if(!($(window).width()<768)){var e=$(this).data("media");$('.plus-minus-media[data-id="'+e+'"]').css("background-image");$(this).addClass("color-theme"),$(".player-stat-image").addClass("media-shown"),$('.plus-minus-media[data-id="'+e+'"]').addClass("visible")}},this.hideMedia=function(){var e=$(this).data("media");$(this).removeClass("color-theme"),$(".player-stat-image").removeClass("media-shown"),$('.plus-minus-media[data-id="'+e+'"]').removeClass("visible")},this.loadGifs=function(){i.loaded||$(window).width()<=1023||(i.loaded=!0,_.each(i.el.find(".plus-minus-media"),function(e){var t=$(e).find("img");t.attr("src",t.data("src"))}))},this.sortChange=function(e){i.sort=e.sort},this.size=function(e){i.size=e.size},this.update=function(e){this.data=e,this.loaded=!1;var t=$("body").hasClass("mobile")?1e3:500;i.el.removeClass("big guard forward").addClass(i.data.position_group),setTimeout(function(){i.el.find(".rank-column img").attr("src","img/players/"+i.data.filter_id+".png")},500),setTimeout(function(){$(i.el).find(".info-column").html(i.infoTemplate(i.data)),$(i.el).find(".ringer-coverage").html(i.coverageTemplate(i.data))},t)},this.init(),i}function CardList(){var e=this;return this.$el=$("#item-list"),this.templateSource=$("#player-card-template").html(),this.template=Handlebars.compile(this.templateSource),this.coverageTemplateSource=$("#coverage-template").html(),this.coverage_template=Handlebars.compile(this.coverageTemplateSource),this.cards=[],this.sort_id=GLOBALS.current_sort,this.filter_id="all",this.initial_player=GLOBALS.player||!1,this.filterOffsetPos=$("#content").offset().top+parseInt($("#content").css("padding-top"),10),this.introOffsetPos=$("#intro").offset().top,this.size="medium",this.cards=[],this.init=function(){this.initEvents(),this.scrollWatch(),this.initial_player&&e.openPlayer(),this.initCards()},this.initCards=function(){var t,i=0;_.each(GLOBALS.list[e.sort_id],function(s,o){var a=s.filter_id;s=_.findWhere(GLOBALS.data.players,{filter_id:a}),s?(i++,t=new Card(i,s),e.cards.push(t)):console.log("missing player",a)})},this.initEvents=function(){$("#filters").on("click","a",this.filter),$("#filter-bar").on("click",".filter:not(.active_filter)",this.sort),$(".size-toggle").on("click","li",this.changeSize),$(".size-toggle").on("mouseenter","li",this.previewSize),$(".size-toggle").on("mouseleave","li",this.revertSize),GLOBALS.player||$(window).on("scroll",e.scrollWatch)},this.previewSize=function(){e.size_preview=$(this).data("size"),$(".size-indicator").attr("class","size-indicator").addClass(e.size_preview)},this.revertSize=function(){$(".size-indicator").attr("class","size-indicator").addClass(e.size)},this.windowResize=function(){var t=$(window).width();clearTimeout(e.sizeTimeout),e.sizeTimeout=setTimeout(function(){t=$(window).width(),e.filterOffsetPos=$("#content").offset().top+parseInt($("#content").css("padding-top"),10)},250),t<1100&&t>767?($("body").removeClass("mobile"),$("body").addClass("tablet no-transition")):t<768?($("body").removeClass("tablet"),$("body").addClass("mobile no-transition")):($("body").addClass("no-transition"),$("body").removeClass("tablet mobile")),setTimeout(function(){$("body").removeClass("no-transition")},100)},this.openPlayer=function(){var t=!1,i=$('.card-item[data-id="'+GLOBALS.player+'"]'),s=i.offset().top,o=$(window).width()<768?$("#mobile-nav").height()+40:100,a=$(window).width()<768?500:0;setTimeout(function(){$("body,html").animate({scrollTop:s-o},function(){$("body").addClass("filter-fixed"),clearTimeout(t),t=setTimeout(function(){events.publish("card.expanded",{id:GLOBALS.player}),$(window).on("scroll.scrollWatch",e.scrollWatch)},100)})},a)},this.changeSize=function(t,i){t.preventDefault();var s;e.old_size=e.size,e.size=i||$(this).data("size"),events.publish("size.update",{size:e.size}),s=e.old_size+"-to-"+e.size,$(".size-indicator").attr("class","size-indicator").addClass(e.size),$(".size-toggle .active").removeClass("active background-theme"),$(this).addClass("active background-theme"),$("body").removeClass("small medium large").addClass(e.size+" "+s)},this.scrollWatch=function(){var t=$(window).scrollTop();t>e.filterOffsetPos?$("body").addClass("filter-fixed"):$("body").removeClass("filter-fixed"),t>e.introOffsetPos&&$(".heading-wrapper:visible")&&$(window).width()>767?$(".heading-wrapper").hide():t<=e.introOffsetPos&&$(".heading-wrapper:hidden")&&$(window).width()>767&&$(".heading-wrapper").show()},this.setColors=function(){var t=GLOBALS.theme_colors[e.sort_id];$("body").removeClass("ringer kevin danny jonathan az"),$("body").addClass(e.sort_id),$(".stroke").attr("style","stroke:"+t+";"),$(".arrow").attr("style","fill:"+t+";")},this.sort=function(t){t.preventDefault(),t.stopPropagation();$("body").addClass("rebuilding"),$(".active_filter").removeClass("active_filter"),$(t.currentTarget).addClass("active_filter"),e.sort_id=$(t.currentTarget).data("sort-id"),e.setColors(),e.buildList(GLOBALS.data.players),events.publish("sort.update",{sort:e.sort_id})},this.filter=function(t){e.filter_id=$(t.currentTarget).data("filter"),$("#filters a.active, #mobile-nav .nav-filter a").removeClass("active color-theme"),$(t.currentTarget).addClass("active color-theme"),$(window).scrollTop()>e.filterOffsetPos&&($(window).width()<767?$("html,body").scrollTop(e.filterOffsetPos+1):$("body,html").animate({scrollTop:e.filterOffsetPos+1})),"all"===e.filter_id?e.$el.removeClass("filtered big guard forward"):(e.$el.removeClass("big guard forward"),e.$el.addClass("filtered "+e.filter_id))},this.buildList=function(){var t=0;$(window).width()<767?$("html,body").scrollTop(e.filterOffsetPos+1):$("html,body").animate({scrollTop:e.filterOffsetPos+1}),_.each(GLOBALS.list[e.sort_id],function(i,s){(i=_.findWhere(GLOBALS.data.players,{filter_id:i.filter_id}))&&e.cards[s]&&(t++,e.cards[s].update(i))}),setTimeout(function(){$("body").removeClass("rebuilding")},1e3)},this.init(),e}function Mobile(e){var t=this;return t.list=e,t.filterOffsetPos=$("#content").offset().top,t.size="medium",t.init=function(){t.initEvents()},t.initEvents=function(){$("#mobile-nav").on("click",".toggle-zone",t.toggleMobileNav),$("#mobile-nav").on("click",".toggle-close",t.toggleMobileNav),$("#mobile-nav").on("click",".sort li",t.mobileSort),$("#mobile-nav").on("click",".nav-filter a",t.mobileFilter),$("#mobile-nav .nav-switcher").on("click","a",t.mobileChangeSize)},this.toggleMobileNav=function(){window.clearTimeout(t.navTimeout),$(window).scrollTop()<t.filterOffsetPos&&!$("#mobile-nav").hasClass("open")&&$("body,html").scrollTop(t.filterOffsetPos+1),$("#mobile-nav").toggleClass("open")},this.mobileChangeSize=function(e){e.preventDefault();$(this).data("size");$("#mobile-nav").removeClass("open"),t.old_size=t.size,t.size=$(this).data("size"),events.publish("size.update",{size:t.size}),transitionClass=t.old_size+"-to-"+t.size,$(".size-indicator").attr("class","size-indicator").addClass(t.size),$("#mobile-nav .size-toggle .active").removeClass("active background-theme"),$('#mobile-nav .size-toggle li[data-size="'+t.size+'"]').addClass("active background-theme"),$("#mobile-nav .nav-switcher a").removeClass("active color-theme"),$(e.target).addClass("active color-theme"),setTimeout(function(){$("body").removeClass("small medium large").addClass(t.size+" "+transitionClass)},100)},t.mobileSort=function(e){e.preventDefault(),$("#mobile-nav").removeClass("open"),setTimeout(function(){$("#mobile-nav .current-sort").text($(e.target).text()),$("#mobile-nav .sort li").removeClass("active color-theme"),$(e.target).addClass("active color-theme"),t.list.sort(e)},100)},t.mobileFilter=function(e){e.preventDefault(),$("#mobile-nav").removeClass("open"),setTimeout(function(){t.list.filter(e)},100)},t.init(),t}var events=function(){var e={},t=e.hasOwnProperty;return{subscribe:function(i,s){t.call(e,i)||(e[i]=[]);var o=e[i].push(s)-1;return{remove:function(){delete e[i][o]}}},publish:function(i,s){t.call(e,i)&&e[i].forEach(function(e){e(void 0!=s?s:{})})}}}();$(document).ready(function(){var e=new CardList;new Mobile(e)}),function(){for(var e,t=function(){},i=["assert","clear","count","debug","dir","dirxml","error","exception","group","groupCollapsed","groupEnd","info","log","markTimeline","profile","profileEnd","table","time","timeEnd","timeline","timelineEnd","timeStamp","trace","warn"],s=i.length,o=window.console=window.console||{};s--;)e=i[s],o[e]||(o[e]=t)}();