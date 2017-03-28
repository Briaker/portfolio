$(function() {
    const tabs = $("#tabs");

    const tabPanelWrapper = $(tabs).find("div").first().attr({
        "class": "tabPanelWrapper",
        "aria-hidden": "true"
    });

    // console.log(tabPanelWrapper);

    const tabPanelInnerWrapper = $(tabPanelWrapper).find("div").first().attr({
        "class": "tabPanelInnerWrapper",
        "aria-hidden": "true"
    });

    const tabPanels = $(tabPanelInnerWrapper).children("div").attr({
        "class": "tabPanel",
        "aria-hidden": "true"
    });

    const panelWidth = $(tabPanels[0])
        .css('width')
        .replace(/[^-\d\.]/g, '')
    ;

    tabPanelInnerWrapper.css('width', panelWidth * tabPanels.length + 100);
    
    // Get the list of tab links
    const tabsList = tabs.find("ul:first").attr({
        "class": "tabsList",
    });

    // For each item in the tabs list...
    $(tabsList).find("li > a").each(
        function(a){
            var tab = $(this);

            // Create a unique id using the tab link's href
            var tabId = "tab-" + tab.attr("href").slice(1);

            // Assign tab id and aria-selected attribute to the tab control, but do not remove the href
            tab.attr({
                "id": tabId,
                "aria-selected": "false",
            }).parent().attr("role", "presentation");

            // Assign aria attribute to the relevant tab panel
            $(tabs).find(".tabPanel").eq(a).attr("aria-labelledby", tabId);

            // Set the click event for each tab link
            tab.click(
                function(e){
                    // Prevent default click event
                    e.preventDefault();

                    const index = tab.parent().index();
                    const indexes = [];

                    tabPanels.each((i, tabPanel) => {
                        if(i !== index) {
                            $(tabPanel).attr("aria-hidden", "true");
                        }
                        else {
                            $(tabPanel).attr("aria-hidden", "false");
                        }
                    });

                    // Change state of previously selected tabList item
                    $(tabsList).find("> li.current").removeClass("current").find("> a").attr("aria-selected", "false");

                    // tabPanelInnerWrapper gets pushed to the left by like 50% when jquery tries to change the css
                    tabPanelInnerWrapper.css(`left`, panelWidth * index * -1);

                    tab.attr("aria-selected", "true").parent().addClass("current");

                    // Set focus to the first heading in the newly revealed tab content
                    tabPanelInnerWrapper.one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', () => {
                        $(tabPanels[index]).children("p").first().attr("tabindex", -1).focus();
                    });
                    
                    
                }
            );
        }
    );

    // Set keydown events on tabList item for navigating tabs
    $(tabsList).delegate("a", "keydown",
        function (e) {
            var tab = $(this);
            switch (e.which) {
                case 37: case 38:
                    if (tab.parent().prev().length!=0) {
                        tab.parent().prev().find("> a").click();
                    } else {
                        $(tabsList).find("li:last > a").click();
                    }
                    break;
                case 39: case 40:
                    if (tab.parent().next().length!=0) {
                        tab.parent().next().find("> a").click();
                    } else {
                        $(tabsList).find("li:first > a").click();
                    }
                    break;
            }
        }
    );

    // Set state for the first tabsList li
    $(tabsList).find("li:first").addClass("current").find(" > a").attr({
        "aria-selected": "true",
        "tabindex": "0"
    });

    $('#readMoreButton').on('click', () => {
        var target = $('#aboutMe');

        $('html, body').animate({
            scrollTop: target.offset().top
        }, 1000);

    });
});


