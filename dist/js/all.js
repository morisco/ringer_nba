function Card(e,i){var t=this;return this.data=i,this.id=e,this.el=$('.card-item[data-id="'+this.data.filter_id+'"]'),this.size="medium",this.sort=GLOBALS.current_sort,this.infoTemplateSource=$("#info-template").html(),this.infoTemplate=Handlebars.compile(this.infoTemplateSource),this.init=function(){this.initEvents()},this.initEvents=function(){this.el.on("click.whole",this.toggleWholeCard),this.el.on("mouseenter",this.loadGifs),this.el.on("mouseenter",this.showColor),this.el.on("mouseleave",this.hideColor),this.el.find(".has-media").on("mouseenter",this.showMedia),this.el.find(".has-media").on("tap",this.showMedia),this.el.find(".has-media").on("mouseleave",this.hideMedia),this.el.on("click",".toggle-card",this.toggleCard),events.subscribe("filter.update",this.filter),events.subscribe("sort.update",this.sortChange),events.subscribe("size.update",this.size),events.subscribe("card.expanded",this.openPlayer)},this.openPlayer=function(e){e.id===t.data.filter_id&&(t.el.off("click.whole"),t.toggleCard())},this.toggleCard=function(e){t.el.toggleClass("expanded-card"),t.el.hasClass("expanded-card")?(t.el.off("click.whole"),t.hideColor()):t.el.on("click.whole",t.toggleWholeCard)},this.toggleWholeCard=function(){"large"===t.size||t.el.hasClass("expanded-card")||(t.el.off("click.whole"),t.el.addClass("expanded-card"),t.hideColor())},this.showColor=function(){t.el.hasClass("expanded-card")||!$("body").hasClass("small")&&!$("body").hasClass("medium")||(t.el.find(".info-column").attr("style","color:"+GLOBALS.theme_colors[t.sort]+"!important;"),t.el.find(".info-column .stat-wrap").attr("style","border-color:"+GLOBALS.theme_colors[t.sort]+"!important;"))},this.hideColor=function(){t.el.find(".info-column").removeAttr("style"),t.el.find(".info-column .stat-wrap").removeAttr("style")},this.showMedia=function(){var e=$(this).data("media");$('.plus-minus-media[data-id="'+e+'"]').css("background-image");$(this).addClass("color-theme"),$(".player-stat-image").addClass("media-shown"),$('.plus-minus-media[data-id="'+e+'"]').addClass("visible"),$('.plus-minus-media[data-id="'+e+'"] img').attr("src",""),$('.plus-minus-media[data-id="'+e+'"] img').attr("src",e)},this.hideMedia=function(){var e=$(this).data("media");$(this).removeClass("color-theme"),$(".player-stat-image").removeClass("media-shown"),$('.plus-minus-media[data-id="'+e+'"]').removeClass("visible")},this.loadGifs=function(){t.loaded||(t.loaded=!0,_.each(t.el.find(".plus-minus-media"),function(e){var i=$(e).find("img");i.attr("src",i.data("src"))}))},this.sortChange=function(e){t.sort=e.sort},this.size=function(e){t.size=e.size},this.update=function(e){this.data=e,this.loaded=!1;var i=$("body").hasClass("mobile")?2e3:1500;setTimeout(function(){$(t.el).find(".info-column").html(t.infoTemplate(t.data))},i)},this.init(),t}function CardList(){var e=this;return this.$el=$("#item-list"),this.templateSource=$("#player-card-template").html(),this.template=Handlebars.compile(this.templateSource),this.coverageTemplateSource=$("#coverage-template").html(),this.coverage_template=Handlebars.compile(this.coverageTemplateSource),this.cards=[],this.sort_id=GLOBALS.current_sort,this.filter_id="all",this.initial_player=GLOBALS.player||!1,this.filterOffsetPos=$("#content").offset().top,this.size="medium",this.cards=[],this.init=function(){this.initEvents(),this.scrollWatch(),this.initial_player&&e.openPlayer(),this.initCards()},this.initCards=function(){var i,t=0;_.each(GLOBALS.list[e.sort_id],function(s,o){var a=s.filter_id;s=_.findWhere(GLOBALS.data.players,{filter_id:a}),s?(t++,i=new Card(t,s),e.cards.push(i)):console.log("missing player",a)})},this.initEvents=function(){$("#filters").on("click","a",this.filter),$("#filter-bar").on("click",".filter:not(.active_filter)",this.sort),$(".size-toggle").on("click","li",this.changeSize),$(".size-toggle").on("mouseenter","li",this.previewSize),$(".size-toggle").on("mouseleave","li",this.revertSize),$(window).on("resize",this.windowResize),GLOBALS.player||$(window).on("scroll",e.scrollWatch)},this.previewSize=function(){e.size_preview=$(this).data("size"),$(".size-indicator").attr("class","size-indicator").addClass(e.size_preview)},this.revertSize=function(){$(".size-indicator").attr("class","size-indicator").addClass(e.size)},this.windowResize=function(){var i=$(window).width();clearTimeout(e.sizeTimeout),e.sizeTimeout=setTimeout(function(){i=$(window).width(),e.filterOffsetPos=$("#content").offset().top},250),i<1100&&i>767?($("body").removeClass("mobile"),$("body").addClass("tablet no-transition")):i<768?($("body").removeClass("tablet"),$("body").addClass("mobile no-transition")):($("body").addClass("no-transition"),$("body").removeClass("tablet mobile")),setTimeout(function(){$("body").removeClass("no-transition")},100)},this.openPlayer=function(){var i=!1,t=$('.card-item[data-id="'+GLOBALS.player+'"]'),s=t.offset().top,o=$(window).width()<768?$("#mobile-nav").height()+40:100,a=$(window).width()<768?500:0;setTimeout(function(){$("body,html").animate({scrollTop:s-o},function(){$("body").addClass("filter-fixed"),clearTimeout(i),i=setTimeout(function(){events.publish("card.expanded",{id:GLOBALS.player}),$(window).on("scroll.scrollWatch",e.scrollWatch)},100)})},a)},this.changeSize=function(i,t){i.preventDefault();var s;e.old_size=e.size,e.size=t||$(this).data("size"),events.publish("size.update",{size:e.size}),s=e.old_size+"-to-"+e.size,$(".size-indicator").attr("class","size-indicator").addClass(e.size),$(".size-toggle .active").removeClass("active background-theme"),$(this).addClass("active background-theme"),$("body").removeClass("small medium large").addClass(e.size+" "+s)},this.scrollWatch=function(){$(window).scrollTop()>e.filterOffsetPos?$("body").addClass("filter-fixed"):$("body").removeClass("filter-fixed")},this.setColors=function(){var i=GLOBALS.theme_colors[e.sort_id];$("body").removeClass("ringer kevin danny jonathan az"),$("body").addClass(e.sort_id),$(".stroke").attr("style","stroke:"+i+";"),$(".arrow").attr("style","fill:"+i+";")},this.sort=function(i){i.preventDefault(),i.stopPropagation();$("body").addClass("rebuilding"),$(".active_filter").removeClass("active_filter"),$(i.currentTarget).addClass("active_filter"),e.sort_id=$(i.currentTarget).data("sort-id"),e.setColors(),e.buildList(GLOBALS.data.players),events.publish("sort.update",{sort:e.sort_id})},this.filter=function(i){console.log(i),e.filter_id=$(i.currentTarget).data("filter"),$("#filters a.active, #mobile-nav .nav-filter a").removeClass("active color-theme"),$(i.currentTarget).addClass("active color-theme"),$(window).scrollTop()>e.filterOffsetPos&&$("body,html").animate({scrollTop:e.filterOffsetPos+1}),"all"===e.filter_id?e.$el.removeClass("filtered big guard forward"):(e.$el.removeClass("big guard forward"),e.$el.addClass("filtered "+e.filter_id))},this.buildList=function(){var i=0;$("html,body").animate({scrollTop:e.filterOffsetPos+1}),_.each(GLOBALS.list[e.sort_id],function(t,s){(t=_.findWhere(GLOBALS.data.players,{filter_id:t.filter_id}))&&e.cards[s]&&(i++,e.cards[s].update(t))}),setTimeout(function(){$("body").removeClass("rebuilding")},1e3)},this.init(),e}function Mobile(e){var i=this;return i.list=e,i.filterOffsetPos=$("#content").offset().top,i.size="medium",i.init=function(){i.initEvents()},i.initEvents=function(){$("#mobile-nav").on("click",".toggle-zone",i.toggleMobileNav),$("#mobile-nav").on("click",".toggle-close",i.toggleMobileNav),$("#mobile-nav").on("click",".sort li",i.mobileSort),$("#mobile-nav").on("click",".nav-filter a",i.mobileFilter),$("#mobile-nav .nav-switcher").on("click","a",i.mobileChangeSize)},this.toggleMobileNav=function(){window.clearTimeout(i.navTimeout),$(window).scrollTop()<i.filterOffsetPos&&!$("#mobile-nav").hasClass("open")&&$("body,html").scrollTop(i.filterOffsetPos+1),$("#mobile-nav").toggleClass("open")},this.mobileChangeSize=function(e){e.preventDefault();$(this).data("size");$("#mobile-nav").removeClass("open"),i.old_size=i.size,i.size=$(this).data("size"),events.publish("size.update",{size:i.size}),transitionClass=i.old_size+"-to-"+i.size,$(".size-indicator").attr("class","size-indicator").addClass(i.size),$("#mobile-nav .size-toggle .active").removeClass("active background-theme"),$('#mobile-nav .size-toggle li[data-size="'+i.size+'"]').addClass("active background-theme"),$("#mobile-nav .nav-switcher a").removeClass("active color-theme"),$(e.target).addClass("active color-theme"),setTimeout(function(){$("body").removeClass("small medium large").addClass(i.size+" "+transitionClass)},100)},i.mobileSort=function(e){e.preventDefault(),$("#mobile-nav").removeClass("open"),setTimeout(function(){$("#mobile-nav .current-sort").text($(e.target).text()),$("#mobile-nav .sort li").removeClass("active color-theme"),$(e.target).addClass("active color-theme"),i.list.sort(e)},100)},i.mobileFilter=function(e){e.preventDefault(),$("#mobile-nav").removeClass("open"),setTimeout(function(){i.list.filter(e)},100)},i.init(),i}var events=function(){var e={},i=e.hasOwnProperty;return{subscribe:function(t,s){i.call(e,t)||(e[t]=[]);var o=e[t].push(s)-1;return{remove:function(){delete e[t][o]}}},publish:function(t,s){i.call(e,t)&&e[t].forEach(function(e){e(void 0!=s?s:{})})}}}();$(document).ready(function(){var e=new CardList;new Mobile(e)}),function(){for(var e,i=function(){},t=["assert","clear","count","debug","dir","dirxml","error","exception","group","groupCollapsed","groupEnd","info","log","markTimeline","profile","profileEnd","table","time","timeEnd","timeline","timelineEnd","timeStamp","trace","warn"],s=t.length,o=window.console=window.console||{};s--;)e=t[s],o[e]||(o[e]=i)}();