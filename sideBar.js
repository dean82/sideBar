/*
    var sideBar = new sideBar( $('#container'),{
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

function sideBar(container, attrs) {
    var isIE6 = /MSIE 6\.0/.test(navigator.userAgent);
    var sideBar     = null;
    var isOpacity    = false; // 是否已透明
    var isVertical   = true;  // 是否垂直无限制 true为限制
    var isHorizontal = true;  // 是否水平无限制 true为限制

    var scrollTop = 0;
    var scrollLeft = 0;

    var sideBarWidth = 0;
    var sideBarHeight = 0;

    var windowHeight = 0;
    var windowWidth = 0;

    var containerWdith = 0;
    var containerHeight = 0;

    var sideBarOffset  = null;
    var containerOffset = null;

    var sideBarLeftBorder = 0;
    var sideBarTopBorder = 0;
    var sideBarRightBorder = 0;
    var sideBarBottomBorder = 0;

    function refreshPosition() {
        scrollTop = $(window).scrollTop();
        scrollLeft = $(window).scrollLeft();

        sideBarHeight = sideBar.height();
        sideBarWidth = sideBar.width();

        containerWdith = container.width();
        containerHeight = container.height();

        windowHeight = $(window).height();
        windowWidth = $(window).width();
        
        sideBarOffsetTop = sideBar.offset().top;
        sideBarOffsetLeft = sideBar.offset().left;

        containerOffsetTop = container.offset().top;
        containerOffsetLeft = container.offset().left;

        if (/MSIE 7\.0/.test(navigator.userAgent)) {
            var level = getZoomLevel();

            scrollTop  = Math.round($(window).scrollTop()/level);
            scrollLeft = Math.round($(window).scrollLeft()/level);

            sideBarOffsetTop   = Math.round(sideBar.offset().top/level);
            sideBarOffsetLeft  = Math.round(sideBar.offset().left/level);

            containerOffsetTop  = Math.round(container.offset().top/level);
            containerOffsetLeft = Math.round(container.offset().left/level);

            windowHeight = Math.round($(window).height()/level);
            windowWidth  = Math.round($(window).width()/level);
        }

        sideBarLeftBorder = sideBarOffsetLeft;
        sideBarTopBorder = sideBarOffsetTop;
        sideBarRightBorder = sideBarOffsetLeft + sideBarWidth;
        sideBarBottomBorder = sideBarOffsetTop  + sideBarHeight;
    }

    function setPositionAttr() {
        if (isIE6) {
            var sideBarTop = attrs.top ? attrs.top : ($(window).height() - sideBar.height() - attrs.bottom);
            sideBar.css("position", "absolute");
            $(window).bind('scroll', function() {
                sideBar.css({top: scrollTop + sideBarTop, bottom: "auto"});
            });
        } else {
            sideBar.css("position", "fixed");
        }
    }

    function setPosition() {
        if (!isNaN(attrs.top)) {
            sideBar.css({top: attrs.top});
        }
        if (!isNaN(attrs.right)) {
            sideBar.css({right: attrs.right});
        }
        if (!isNaN(attrs.left)) {
            sideBar.css({left: attrs.left});
        }
        if (!isNaN(attrs.bottom)) {
            sideBar.css({bottom: attrs.bottom});
        }
    } 

    // padding为负值时，padding框在容器外面，top, bottom和right, left为距窗口top和left距离。
    //                   containerTopBorder
    //    -------------------------------------------------
    //    |paddingLeft             paddingTop             |
    //    | ↓ -----------------------------------------   |
    //    |   |    sideBarTopBorder                  |   |
    //    |   |     ----              container       |   |
    //    |   |     |  |                              |   |
    // cL |   |  tL |  | sideBarRightBorder          |   | containerRightBorder
    //    |   |     |  |                              |   |
    //    |   |     ----                              |   |
    //    |   |      tB   ↖                          |   |
    //    |   |          sideBar                     |   |
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

        if (opacityBottomBorder < sideBarTopBorder || sideBarRightBorder < opacityLeftBorder || sideBarBottomBorder < opacityTopBorder || opacityRightBorder < sideBarLeftBorder) {
            // 在透明区域外部
            isOpacity = false;
            sideBar.css("opacity", 1);
        } else {
            // 进入到透明区域
            isOpacity = true;
            sideBar.css("opacity", attrs.opacity);
        }
    }

    function dealIE6() {
        refreshPosition();

        var containerLeftBorder = containerOffsetLeft + attrs.paddingLeft;
        var containerTopBorder = containerOffsetTop  + attrs.paddingTop;
        var containerRightBorder = containerOffsetLeft + containerWdith  - attrs.paddingRight;
        var containerBottomBorder = containerOffsetTop  + containerHeight - attrs.paddingBottom;

        var sideBarTop = (attrs.top !== undefined) ? (attrs.top + scrollTop) : (windowHeight - sideBarHeight - attrs.bottom +scrollTop);
        var sideBarLeft = (attrs.left !== undefined) ? (attrs.left + scrollLeft) : (windowWidth - sideBarWidth - attrs.right + scrollLeft);

        if (isVertical) {
            // 上
            if (sideBarTopBorder < containerTopBorder || containerTopBorder > sideBarTop ) {
                sideBar.css({top: containerTopBorder, bottom: "auto"});
            } else {
                sideBar.css({top: sideBarTop, bottom: "auto"});
            }
            // 下
            if (sideBarBottomBorder > containerBottomBorder || windowHeight + scrollTop - containerBottomBorder > attrs.bottom || containerBottomBorder - scrollTop - sideBarHeight< attrs.top) {
                sideBar.css({top: containerBottomBorder - sideBarHeight, bottom: "auto"});
            }
        } else {
            sideBar.css({top: sideBarTop, bottom: "auto"});
        }

        if (isHorizontal) {
            // 左
            if (sideBarLeftBorder < containerLeftBorder || containerLeftBorder > attrs.left) {
                sideBar.css({left: containerLeftBorder, right: "auto"});
            } else {
                if (attrs.left !== undefined) sideBar.css({left: sideBarLeft, right: "auto"});
            }
            // 右
            if (sideBarRightBorder > containerRightBorder && windowWidth > containerRightBorder || windowWidth - attrs.right > containerRightBorder) {
                sideBar.css({left: containerRightBorder - sideBarWidth, right: "auto"});
            } else {
                if (attrs.right !== undefined) sideBar.css({right: attrs.right, left: "auto"});
            }
        } else {
            sideBar.css({left: sideBarLeft, right: "auto"});
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

        var sideBarTop = (attrs.top !== undefined) ? attrs.top : (windowHeight - sideBarHeight - attrs.bottom);

        if (isVertical) {
            // 上
            if (sideBarTopBorder < containerTopBorder || containerTopBorder - scrollTop > sideBarTop) {
                sideBar.css({top: containerTopBorder - scrollTop, bottom: "auto"});
            } else {
                sideBar.css({top: sideBarTop, bottom: "auto"});
            }
            
            // 更新数据
            sideBarBottomBorder = sideBarOffsetTop  + sideBarHeight;
            containerBottomBorder = containerOffsetTop  + containerHeight - attrs.paddingBottom;

            // 下
            if (sideBarBottomBorder > containerBottomBorder || windowHeight + scrollTop - containerBottomBorder > attrs.bottom || containerBottomBorder - scrollTop < sideBarHeight + attrs.top) {
                sideBar.css({top: containerBottomBorder - sideBarHeight - scrollTop, bottom: "auto"});
            } else {
                if (attrs.bottom !== undefined && containerTopBorder - scrollTop <= sideBarTop) sideBar.css({bottom: attrs.bottom, top: "auto"});
            }
        }

        if (isHorizontal) {
            // 左
            if (sideBarLeftBorder < containerLeftBorder || containerLeftBorder - attrs.left > 0) {
                sideBar.css({left: containerLeftBorder, right: "auto"});
            } else {
                if (attrs.left !== undefined) sideBar.css({left: attrs.left, right: "auto"});
            }

            // 右
            if (sideBarRightBorder > containerRightBorder && windowWidth > containerRightBorder || windowWidth - attrs.right > containerRightBorder) {
                sideBar.css({left: containerRightBorder - sideBarWidth, right: "auto"});
            } else {
                if (attrs.right !== undefined) sideBar.css({right: attrs.right, left: "auto"});
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
            clearTimeout(sideBar.timer);
            sideBar.timer = setTimeout(function() {
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
        sideBar.unbind('mouseover.sideBar').bind('mouseover.sideBar', function() {
            sideBar.css('zIndex', attrs.zIndex+1);
            if (!isOpacity) return;
            sideBar.stop().animate({
                opacity: num
            }, 300);
        });

        sideBar.unbind('mouseout.sideBar').bind('mouseout.sideBar', function() {
            sideBar.css('zIndex', attrs.zIndex);
            if (!isOpacity) return;
            sideBar.stop().animate({
                opacity: attrs.opacity
            }, 300);
        });
    }

    function init() {
        dealDefault();
        sideBar = $(attrs.content).appendTo($("body"));
        sideBar.css('zIndex', 1000);
        setPositionAttr();
        setPosition();
        dealPosition();
        dealOpacity();
        bindEvent();
    }

    init();

    this.show = function() {
        sideBar.css('display', 'block');
    };

    this.hide = function() {
        sideBar.css('display', 'none');
    };

    this.setOpacity = function(num) {
        bindSetOpacityEvent(num);
    };
}