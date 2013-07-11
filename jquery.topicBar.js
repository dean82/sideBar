/*
    var topicBar = new TopicBar( $('#container'),{
        paddingTop : 0,
        paddingLeft : -20,
        paddingRight : -20,
        paddingBottom : 0,
        opacityPaddingTop : 0,
        opacityPaddingLeft : 100,
        opacityPaddingRight : 20,
        opacityPaddingBottom : 0,
        opacity : 0.5,         进入透明区的透明度，1为永不透明
        hoverOpacity: 1,       鼠标hover时的透明度
        top : 40,
        left : 20,
        zIndex: 1000,          默认99999
        content : "xxxxxx" 页面内容
    } );
*/

function TopicBar(container, attrs) {
    var isIE6 = /MSIE 6\.0/.test(navigator.userAgent);
    var topicBar     = null;
    var isOpacity    = false; // 是否已透明
    var isVertical   = true;  // 是否垂直无限制 true为限制
    var isHorizontal = true;  // 是否水平无限制 true为限制

    var scrollTop = 0;
    var scrollLeft = 0;

    var topicBarWidth = 0;
    var topicBarHeight = 0;

    var windowHeight = 0;
    var windowWidth = 0;

    var containerWdith = 0;
    var containerHeight = 0;

    var topicBarOffset  = null;
    var containerOffset = null;

    var topicBarLeftBorder = 0;
    var topicBarTopBorder = 0;
    var topicBarRightBorder = 0;
    var topicBarBottomBorder = 0;

    function refreshPosition() {
        scrollTop = $(window).scrollTop();
        scrollLeft = $(window).scrollLeft();

        topicBarHeight = topicBar.height();
        topicBarWidth = topicBar.width();

        containerWdith = container.width();
        containerHeight = container.height();

        windowHeight = $(window).height();
        windowWidth = $(window).width();
        
        topicBarOffsetTop = topicBar.offset().top;
        topicBarOffsetLeft = topicBar.offset().left;

        containerOffsetTop = container.offset().top;
        containerOffsetLeft = container.offset().left;

        if (/MSIE 7\.0/.test(navigator.userAgent)) {
            var level = getZoomLevel();

            scrollTop  = Math.round($(window).scrollTop()/level);
            scrollLeft = Math.round($(window).scrollLeft()/level);

            topicBarOffsetTop   = Math.round(topicBar.offset().top/level);
            topicBarOffsetLeft  = Math.round(topicBar.offset().left/level);

            containerOffsetTop  = Math.round(container.offset().top/level);
            containerOffsetLeft = Math.round(container.offset().left/level);

            windowHeight = Math.round($(window).height()/level);
            windowWidth  = Math.round($(window).width()/level);
        }

        topicBarLeftBorder = topicBarOffsetLeft;
        topicBarTopBorder = topicBarOffsetTop;
        topicBarRightBorder = topicBarOffsetLeft + topicBarWidth;
        topicBarBottomBorder = topicBarOffsetTop  + topicBarHeight;
    }

    function setPositionAttr() {
        if (isIE6) {
            var topicBarTop = attrs.top ? attrs.top : ($(window).height() - topicBar.height() - attrs.bottom);
            topicBar.css("position", "absolute");
            $(window).bind('scroll', function() {
                topicBar.css({top: scrollTop + topicBarTop, bottom: "auto"});
            });
        } else {
            topicBar.css("position", "fixed");
        }
    }

    function setPosition() {
        if (!isNaN(attrs.top)) {
            topicBar.css({top: attrs.top});
        }
        if (!isNaN(attrs.right)) {
            topicBar.css({right: attrs.right});
        }
        if (!isNaN(attrs.left)) {
            topicBar.css({left: attrs.left});
        }
        if (!isNaN(attrs.bottom)) {
            topicBar.css({bottom: attrs.bottom});
        }
    } 

    // padding为负值时，padding框在容器外面，top, bottom和right, left为距窗口top和left距离。
    //                   containerTopBorder
    //    -------------------------------------------------
    //    |paddingLeft             paddingTop             |
    //    | ↓ -----------------------------------------   |
    //    |   |    topicBarTopBorder                  |   |
    //    |   |     ----              container       |   |
    //    |   |     |  |                              |   |
    // cL |   |  tL |  | topicBarRightBorder          |   | containerRightBorder
    //    |   |     |  |                              |   |
    //    |   |     ----                              |   |
    //    |   |      tB   ↖                          |   |
    //    |   |          topicBar                     |   |
    //    |   |                                       |   |
    //    |   ----------------------------------------- ↑ |
    //    |     paddingBottom                 paddingRight|
    //    -------------------------------------------------
    //                  containerBottomBorder

    function dealOpacity() {
        refreshPosition();

        var opacityLeftBorder = containerOffsetLeft + attrs.opacityPaddingLeft;
        var opacityTopBorder = containerOffsetTop  + attrs.opacityPaddingTop;
        var opacityRightBorder = containerOffsetLeft + containerWdith  - attrs.opacityPaddingRight;
        var opacityBottomBorder = containerOffsetTop  + containerHeight - attrs.opacityPaddingBottom;

        if (opacityBottomBorder < topicBarTopBorder || topicBarRightBorder < opacityLeftBorder || topicBarBottomBorder < opacityTopBorder || opacityRightBorder < topicBarLeftBorder) {
            // 在透明区域外部
            isOpacity = false;
            topicBar.css("opacity", 1);
        } else {
            // 进入到透明区域
            isOpacity = true;
            topicBar.css("opacity", attrs.opacity);
        }
    }

    function dealIE6() {
        refreshPosition();

        var containerLeftBorder = containerOffsetLeft + attrs.paddingLeft;
        var containerTopBorder = containerOffsetTop  + attrs.paddingTop;
        var containerRightBorder = containerOffsetLeft + containerWdith  - attrs.paddingRight;
        var containerBottomBorder = containerOffsetTop  + containerHeight - attrs.paddingBottom;

        var topicBarTop = (attrs.top !== undefined) ? (attrs.top + scrollTop) : (windowHeight - topicBarHeight - attrs.bottom +scrollTop);
        var topicBarLeft = (attrs.left !== undefined) ? (attrs.left + scrollLeft) : (windowWidth - topicBarWidth - attrs.right + scrollLeft);

        if (isVertical) {
            // 上
            if (topicBarTopBorder < containerTopBorder || containerTopBorder > topicBarTop ) {
                topicBar.css({top: containerTopBorder, bottom: "auto"});
            } else {
                topicBar.css({top: topicBarTop, bottom: "auto"});
            }
            // 下
            if (topicBarBottomBorder > containerBottomBorder || windowHeight + scrollTop - containerBottomBorder > attrs.bottom || containerBottomBorder - scrollTop - topicBarHeight< attrs.top) {
                topicBar.css({top: containerBottomBorder - topicBarHeight, bottom: "auto"});
            }
        } else {
            topicBar.css({top: topicBarTop, bottom: "auto"});
        }

        if (isHorizontal) {
            // 左
            if (topicBarLeftBorder < containerLeftBorder || containerLeftBorder > attrs.left) {
                topicBar.css({left: containerLeftBorder, right: "auto"});
            } else {
                if (attrs.left !== undefined) topicBar.css({left: topicBarLeft, right: "auto"});
            }
            // 右
            if (topicBarRightBorder > containerRightBorder && windowWidth > containerRightBorder || windowWidth - attrs.right > containerRightBorder) {
                topicBar.css({left: containerRightBorder - topicBarWidth, right: "auto"});
            } else {
                if (attrs.right !== undefined) topicBar.css({right: attrs.right, left: "auto"});
            }
        } else {
            topicBar.css({left: topicBarLeft, right: "auto"});
        }
    }

    function dealPosition() {
        if (isIE6) {
            dealIE6();
            return;
        }
        refreshPosition();

        var containerLeftBorder = containerOffsetLeft + attrs.paddingLeft;
        var containerTopBorder = containerOffsetTop  + attrs.paddingTop;
        var containerRightBorder = containerOffsetLeft + containerWdith  - attrs.paddingRight;
        var containerBottomBorder = containerOffsetTop  + containerHeight - attrs.paddingBottom;

        var topicBarTop = (attrs.top !== undefined) ? attrs.top : (windowHeight - topicBarHeight - attrs.bottom);

        if (isVertical) {
            // 上
            if (topicBarTopBorder < containerTopBorder || containerTopBorder - scrollTop > topicBarTop) {
                topicBar.css({top: containerTopBorder - scrollTop, bottom: "auto"});
            } else {
                topicBar.css({top: topicBarTop, bottom: "auto"});
            }
            
            // 更新数据
            topicBarBottomBorder = topicBarOffsetTop  + topicBarHeight;
            containerBottomBorder = containerOffsetTop  + containerHeight - attrs.paddingBottom;

            // 下
            if (topicBarBottomBorder > containerBottomBorder || windowHeight + scrollTop - containerBottomBorder > attrs.bottom || containerBottomBorder - scrollTop < topicBarHeight + attrs.top) {
                topicBar.css({top: containerBottomBorder - topicBarHeight - scrollTop, bottom: "auto"});
            } else {
                if (attrs.bottom !== undefined && containerTopBorder - scrollTop <= topicBarTop) topicBar.css({bottom: attrs.bottom, top: "auto"});
            }
        }

        if (isHorizontal) {
            // 左
            if (topicBarLeftBorder < containerLeftBorder || containerLeftBorder - attrs.left > 0) {
                topicBar.css({left: containerLeftBorder, right: "auto"});
            } else {
                if (attrs.left !== undefined) topicBar.css({left: attrs.left, right: "auto"});
            }

            // 右
            if (topicBarRightBorder > containerRightBorder && windowWidth > containerRightBorder || windowWidth - attrs.right > containerRightBorder) {
                topicBar.css({left: containerRightBorder - topicBarWidth, right: "auto"});
            } else {
                if (attrs.right !== undefined) topicBar.css({right: attrs.right, left: "auto"});
            }
        }
    }

    function getZoomLevel () {
        var level = 1;
        if (document.body.getBoundingClientRect) {
            var rect = document.body.getBoundingClientRect();
            var physicalW = rect.right - rect.left;
            var logicalW = document.body.offsetWidth;
            level = Math.round ((physicalW / logicalW) * 100) / 100;
        }
        return level;
    }

    function dealDefault() {
        //  若padding未设置，则处理为默认值0
        if (!attrs.paddingLeft && attrs.paddingLeft !== false) {
            attrs.paddingLeft = 0;
        }
        if (!attrs.paddingRight && attrs.paddingRight !== false) {
            attrs.paddingRight = 0;
        }
        if (!attrs.paddingTop && attrs.paddingTop !== false) {
            attrs.paddingTop = 0;
        }
        if (!attrs.paddingBottom && attrs.paddingBottom !== false) {
            attrs.paddingBottom = 0;
        }

        // 判断水平与垂直方向是否限制
        if (attrs.paddingLeft === false || attrs.paddingRight === false) {
            isHorizontal = false;
        }
        if (attrs.paddingTop === false || attrs.paddingBottom === false) {
            isVertical = false;
        }

        // 设置默认hover透明度
        if (isNaN(attrs.hoverOpacity)) {
            attrs.hoverOpacity = 1;
        }

        // 设置默认zIndex
        if (isNaN(attrs.zIndex)) {
            attrs.zIndex = 99999;
        }

        if (isNaN(attrs.top) && isNaN(attrs.bottom)) {
            attrs.top = 0;
        }

        if (isNaN(attrs.left) && isNaN(attrs.right)) {
            attrs.left = 0;
        }
    }

    function bindEvent() {
        $(window).bind('resize', function() {
            clearTimeout(topicBar.timer);
            topicBar.timer = setTimeout(function() {
                dealPosition();
                dealOpacity();
            }, 100);
        });

        $(window).bind('scroll', function() {
            dealPosition();
            dealOpacity();
        });
        bindSetOpacityEvent(attrs.hoverOpacity);
    }

    function bindSetOpacityEvent(num) {
        topicBar.unbind('mouseover.topicBar').bind('mouseover.topicBar', function() {
            topicBar.css('zIndex', attrs.zIndex+1);
            if (!isOpacity) return;
            topicBar.stop().animate({
                opacity: num
            }, 300);
        });

        topicBar.unbind('mouseout.topicBar').bind('mouseout.topicBar', function() {
            topicBar.css('zIndex', attrs.zIndex);
            if (!isOpacity) return;
            topicBar.stop().animate({
                opacity: attrs.opacity
            }, 300);
        });
    }

    function init() {
        dealDefault();
        topicBar = $(attrs.content).appendTo($("body"));
        topicBar.css('zIndex', 1000);
        setPositionAttr();
        setPosition();
        dealPosition();
        dealOpacity();
        bindEvent();
    }

    init();

    this.show = function() {
        topicBar.css('display', 'block');
    };

    this.hide = function() {
        topicBar.css('display', 'none');
    };

    this.setOpacity = function(num) {
        bindSetOpacityEvent(num);
    };
}