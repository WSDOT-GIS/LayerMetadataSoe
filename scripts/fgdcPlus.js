/*jslint browser: true, unparam: true, maxerr: 50, indent: 4 */
/*globals jQuery */

/*
This JavaScript file is for use with the "FGDC Plus HTML5.xsl" stylesheet.
Based on the JavaScript code embedded in the original (Public Domain)"FGDC Plus.xsl" by
Howie Sternberg. (http://arcscripts.esri.com/details.asp?dbid=14674)
*/

/*
Copyright (c) 2011 Washington State Department of Transportation

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>
*/

/*
This jQuery plugin is used to create a layer list control for an ArcGIS JavaScript API web application.
Prerequisites:
jQuery
*/

(function ($) {
    "use strict";

    /* "md-title" onclick function. Always opens md-detailshow and either opens or closes md-detailhide,
    and md-itemhide elements, depending on value of title elements toggledisplay value. Toggledisplay
    value is either "block" to "none" and toggles everytime this function runs. */
    function clicktitle(evt) {
        var elem, p, c, gc, ggc, gggc, ggggc, gggggc, ggggggc, i, j, k, l, m, n, o, elemMenu, elemMenuItem;

        // Get reference to W3C or IE event object
        evt = evt || ((window.event) ? event : null);
        if (evt) {
            // Get reference to element from which event object was created. W3C calls this element target. IE calls it srcElement.
            elem = evt.target || evt.srcElement;
            if (elem.nodeType === 3) {
                // If W3C and element is text node (nodeType = 3), then get reference to container (parent) to equalize with IE event model.
                elem = elem.parentNode;
            }
            if (elem) {
                // Work with element.
                p = elem.parentNode; // parent
                ////var c       // parent's child
                ////var gc      // parent's grandchild
                ////var ggc     // parent's great grandchild
                ////var gggc    // parent's great great grandchild
                ////var ggggc   // parent's great great great grandchild
                ////var gggggc  // parent's great great great great grandchild
                ////var ggggggc // parent's great great great great great grandchild
                // Create toggledisplay attribute when title element is first clicked and set value to "block"
                // in order to open content.
                if (!elem.getAttributeNode("toggledisplay")) {
                    elem.setAttribute("toggledisplay", "block");
                }
                // Loop through child nodes, find those that open and close (md-detail and md-itemhide) 
                // and set their style.display to that of elem.getAttributeNode("toggledisplay").value
                for (i = 0; i < p.childNodes.length; i += 1) {
                    // Show (open) all metadata sections
                    c = p.childNodes[i];
                    c.style.display = "block";
                    for (j = 0; j < c.childNodes.length; j += 1) {
                        gc = c.childNodes[j];
                        for (k = 0; k < gc.childNodes.length; k += 1) {
                            ggc = gc.childNodes[k];
                            if (ggc.className === "md-mastertitle") {
                                // add + or - to master title text
                                if (elem.getAttributeNode("toggledisplay").value === "block") {
                                    ggc.innerHTML = "-" + ggc.innerHTML.substring(1, ggc.innerHTML.length);
                                } else {
                                    ggc.innerHTML = "+" + ggc.innerHTML.substring(1, ggc.innerHTML.length);
                                }
                            }
                            if (ggc.className === "md-detailhide") {
                                // hide or show md-detailhide element
                                ggc.style.display = elem.getAttributeNode("toggledisplay").value;
                            } else if (ggc.className === "md-detailshow") {
                                // make sure md-detailshow is always shown because user could have previously closed it
                                ggc.style.display = "block";
                            } else if (ggc.className === "md-detailhelp") {
                                // make sure md-detailhelp is always not shown
                                ggc.style.display = "none";
                            }
                            for (l = 0; l < ggc.childNodes.length; l += 1) {
                                gggc = ggc.childNodes[l];
                                if (gggc.className === "md-itemhide") {
                                    // hide or show md-itemhide element
                                    gggc.style.display = elem.getAttributeNode("toggledisplay").value;
                                } else if (gggc.className === "md-itemshow") {
                                    // show md-itemshow element
                                    gggc.style.display = "block";
                                }
                                for (m = 0; m < gggc.childNodes.length; m += 1) {
                                    ggggc = gggc.childNodes[m];
                                    if (ggggc.className === "md-itemhide") {
                                        // hide or show md-itemhide element
                                        ggggc.style.display = elem.getAttributeNode("toggledisplay").value;
                                    } else if (ggggc.className === "md-itemshow") {
                                        // show md-itemshow element
                                        ggggc.style.display = "block";
                                    }
                                    for (n = 0; n < ggggc.childNodes.length; n += 1) {
                                        gggggc = ggggc.childNodes[n];
                                        if (gggggc.className === "md-itemhide") {
                                            // hide or show md-itemhide element
                                            gggggc.style.display = elem.getAttributeNode("toggledisplay").value;
                                        } else if (gggggc.className === "md-itemshow") {
                                            // show md-itemshow element
                                            gggggc.style.display = "block";
                                        }
                                        for (o = 0; o < gggggc.childNodes.length; o += 1) {
                                            ggggggc = gggggc.childNodes[o];
                                            if (ggggggc.className === "md-itemhide") {
                                                // hide or show md-itemhide element
                                                ggggggc.style.display = elem.getAttributeNode("toggledisplay").value;
                                            } else if (ggggggc.className === "md-itemshow") {
                                                // show md-itemshow element
                                                ggggggc.style.display = "block";
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (elem.getAttributeNode("toggledisplay").value === "block") {
                    elem.setAttribute("toggledisplay", "none");
                } else {
                    elem.setAttribute("toggledisplay", "block");
                }
            }
            // Prevent event from bubbling past this event handler.
            evt.cancelBubble = true;
            // Show all menus tabs active, indicating to user that all metadata sections are open.		
            elemMenu = document.getElementById("md-menu");
            if (Boolean(elemMenu !== null)) {
                for (i = 0; i < elemMenu.childNodes.length; i += 1) {
                    elemMenuItem = elemMenu.childNodes[i];
                    if (elemMenuItem.className === "md-menuitem") {
                        elemMenuItem.className = "md-menuitemactive";
                    }
                }
            }
        }
    }

    // "md-title" onmouseover and onmouseout function
    function overtitle(evt) {
        // Get reference to W3C or IE event object
        evt = evt || ((window.event) ? event : null);
        if (evt) {
            // Get reference to element from which event object was created. W3C calls this element target. IE calls it srcElement.
            var elem = evt.target || evt.srcElement;
            if (elem.nodeType === 3) {
                // If W3C and element is text node (nodeType = 3), then get reference to container (parent) to equalize with IE event model.
                elem = elem.parentNode;
            }
            if (elem) {
                // Work with element.
                if (elem.className === "md-title") {
                    elem.className = "md-titleover";
                } else if (elem.className === "md-titleover") {
                    elem.className = "md-title";
                }
            }
            // Prevent event from bubbling past this event handler.
            evt.cancelBubble = true;
        }
    }

    // Remove white space text nodes in Netscape 7 and Mozilla Firefox in order to 
    // use same set of javascript functions that work in IE to navigate through HTML. 
    // Although not necessary, this function is called by onload function even for IE.
    function removewhitespace(elem) {
        var i, c;
        for (i = 0; i < elem.childNodes.length; i += 1) {
            c = elem.childNodes[i];
            if (c.nodeType === 1) {
                removewhitespace(c);
            }
            // Use regular expression to test for white space text nodes and remove
            if (((/^\s+$/.test(c.nodeValue))) && (c.nodeType === 3)) {
                elem.removeChild(elem.childNodes[i]);
                i -= 1;
            }
        }
    }

    // Assign event handler functions to md-title element
    function setuptitle(elem) {
        if (elem) {
            if (elem.className === "md-title") {
                elem.onclick = clicktitle;
                elem.onmouseover = overtitle;
                elem.onmouseout = overtitle;
            }
        }
    }

    // "md-clickdef" onclick function. Opens and closes metadata definitions, which "md-def" class div elements
    function clickdef(evt) {
        var aElem, text, elemDefinition, styleDisplay, elem;
        evt = evt || ((window.event) ? event : null);
        if (evt) {
            // Get reference to element from which event object was created. W3C calls this element target. IE calls it srcElement.
            elem = evt.target || evt.srcElement;
            if (elem.nodeType === 3) {
                // If W3C and element is text node (nodeType = 3), then get reference to container (parent) to equalize with IE event model.
                elem = elem.parentNode;
            }
            if (elem) {
                // Work with element.
                elemDefinition = document.getElementById("md-clickdef");
                text = "Show Definitions";
                styleDisplay = "none";
                if (elemDefinition.innerHTML === "Show Definitions") {
                    text = "Hide Definitions";
                    styleDisplay = "block";
                }
                // hide or show metadata definition elements
                aElem = $(".md-def");
                aElem.each(function (i, e) { e.style.display = styleDisplay; });
                elem.innerHTML = text;
            }
        }
    }

    // "md-link" onmouseover and onmouseout function
    function overlink(evt) {
        // Get reference to W3C or IE event object
        evt = evt || ((window.event) ? event : null);
        if (evt) {
            // Get reference to element from which event object was created. W3C calls this element target. IE calls it srcElement.
            var elem = evt.target || evt.srcElement;
            if (elem.nodeType === 3) {
                // If W3C and element is text node (nodeType = 3), then get reference to container (parent) to equalize with IE event model.
                elem = elem.parentNode;
            }
            if (elem) {
                // Work with element.
                if (elem.className === "md-link") {
                    elem.className = "md-over";
                } else if (elem.className === "md-over") {
                    elem.className = "md-link";
                }
            }
            // Prevent event from bubbling past this event handler.
            evt.cancelBubble = true;
        }
    }


    // Assign event handler functions to md-clickdef element
    function setupclickdef(elem) {
        if (elem) {
            if (elem.className === "md-link") {
                elem.onclick = clickdef;
                elem.onmouseover = overlink;
                elem.onmouseout = overlink;
            }
        }
    }

    // "md-menuitem" onclick function. Tabs to different metadata sections.
    function clickmenuitem(evt) {
        var otherNode, elem, elemMaster, i, siblingNodes, listMasterNodeIds;
        // Get reference to W3C or IE event object
        evt = evt || ((window.event) ? event : null);
        if (evt) {
            // Get reference to element from which event object was created. W3C calls this element target. IE calls it srcElement.
            elem = evt.target || evt.srcElement;
            if (elem.nodeType === 3) {
                // If W3C and element is text node (nodeType = 3), then get reference to container (parent) to equalize with IE event model.
                elem = elem.parentNode;
            }
            if (elem) {
                // Work with element
                // Show other menu tabs
                siblingNodes = elem.parentNode.childNodes;
                for (i = 0; i < siblingNodes.length; i += 1) {
                    if (siblingNodes[i] !== elem) {
                        siblingNodes[i].className = "md-menuitem";
                    }
                }
                // Show active menu tab
                elem.className = "md-menuitemactive";
                // Show active menu metadata.
                elemMaster = document.getElementById("md-" + elem.id);
                elemMaster.style.display = "block";
                // Hide all other metadata sections
                listMasterNodeIds = ["md-description", "md-graphic", "md-spatial", "md-structure", "md-quality", "md-source", "md-distribution", "md-metadata"];
                for (i = 0; i < listMasterNodeIds.length; i += 1) {
                    if (listMasterNodeIds[i] !== elemMaster.id) {
                        otherNode = document.getElementById(listMasterNodeIds[i]);
                        if (Boolean(otherNode !== null)) {
                            otherNode.style.display = "none";
                        }
                    }
                }
            }
            // Prevent event from bubbling past this event handler.
            evt.cancelBubble = true;
        }
    }

    // "md-menuitem" onmouseover and onmouseout function
    function overmenuitem(evt) {
        // Get reference to W3C or IE event object
        evt = evt || ((window.event) ? event : null);
        if (evt) {
            // Get reference to element from which event object was created. W3C calls this element target. IE calls it srcElement.
            var elem = evt.target || evt.srcElement;
            if (elem.nodeType === 3) {
                // If W3C and element is text node (nodeType = 3), then get reference to container (parent) to equalize with IE event model.
                elem = elem.parentNode;
            }
            if (elem) {
                // Work with element.
                if (elem.className === "md-menuitem") {
                    elem.className = "md-menuitemover";
                } else if (elem.className === "md-menuitemover") {
                    elem.className = "md-menuitem";
                }
            }
            // Prevent event from bubbling past this event handler.
            evt.cancelBubble = true;
        }
    }


    // Assign event handler functions to md-menuitem elements
    function setupmenu(elem) {
        var i, c;
        if (elem) {
            for (i = 0; i < elem.childNodes.length; i += 1) {
                c = elem.childNodes[i];
                if (c.className === "md-menuitem") {
                    c.onclick = clickmenuitem;
                    c.onmouseover = overmenuitem;
                    c.onmouseout = overmenuitem;
                }
                if (c.className === "md-menuitemactive") {
                    c.onclick = clickmenuitem;
                    c.onmouseover = overmenuitem;
                    c.onmouseout = overmenuitem;
                }
            }
        }
    }

    // Returns element style.display property as a text string. Returns "none" or "block".
    function getcomputeddisplay(elem) {
        var dis;
        if (window.getComputedStyle) {
            // W3C		
            dis = window.getComputedStyle(elem, null).display;
        } else if (elem.currentStyle) {
            // IE
            dis = elem.currentStyle.display;
        }
        return dis;
    }

    // Returns boolean indicating whether all child elements other than a particular class are opened
    function allchildrenopenedexcept(elem, cname) {
        var c, i, opened = true;
        for (i = 0; i < elem.childNodes.length; i += 1) {
            c = elem.childNodes[i];
            if (c.className !== cname) {
                if (getcomputeddisplay(c) === "none") {
                    opened = false;
                    break;
                }
            }
        }
        return opened;
    }

    // Returns boolean indicating whether all child elements other than a particular class are closed
    function allchildrenclosedexcept(elem, cname) {
        var c, i, closed = true;
        for (i = 0; i < elem.childNodes.length; i += 1) {
            c = elem.childNodes[i];
            if (c.className !== cname) {
                if (getcomputeddisplay(c) === "block") {
                    closed = false;
                    break;
                }
            }
        }
        return closed;
    }

    // Returns boolean indicating whether all grand child 
    // and grand child's next sibling child elements are opened
    function allgrandchildrenopened(elem) {
        var i, j, k, c, gc, gcns, gcnsc, opened = true;
        for (i = 0; i < elem.childNodes.length; i += 1) {
            c = elem.childNodes[i];
            for (j = 0; j < c.childNodes.length; j += 1) {
                gc = c.childNodes[j];
                if (gc.className === "md-itemhide") {
                    if (getcomputeddisplay(gc) === "none") {
                        opened = false;
                        break;
                    }
                } else if (gc.className === "md-itemlist") {
                    gcns = gc.nextSibling;
                    for (k = 0; k < gcns.childNodes.length; k += 1) {
                        gcnsc = gcns.childNodes[k];
                        if (gcnsc.className === "md-itemhide") {
                            if (getcomputeddisplay(gcnsc) === "none") {
                                opened = false;
                                break;
                            }
                        }
                    }
                }
            }
            if (!opened) {
                break;
            }
        }
        return opened;
    }

    /* "md-mastertitle" onclick function. Always opens md-detailshow and either opens or closes md-detailhide,
    and md-itemhide elements, depending on whether they are currently all opened or closed. */
    function clickmaster(evt) {
        var p, c, gc, ggc, gggc, ggggc, allClosed, allOpened, i, j, k, l, m, elem, newdisplay;
        // Get reference to W3C or IE event object
        evt = evt || ((window.event) ? event : null);
        if (evt) {
            // Get reference to element from which event object was created. W3C calls this element target. IE calls it srcElement.
            elem = evt.target || evt.srcElement;
            if (elem.nodeType === 3) {
                // If W3C and element is text node (nodeType = 3), then get reference to container (parent) to equalize with IE event model.
                elem = elem.parentNode;
            }
            if (elem) {
                // Work with element.
                p = elem.parentNode.nextSibling;
                // Are all md-detail children (md-detailhide and md-detailshow) currently open or closed?
                allClosed = true;
                allOpened = true;
                allOpened = allchildrenopenedexcept(p, "md-detail");
                allClosed = allchildrenclosedexcept(p, "md-detail");
                allOpened = allchildrenopenedexcept(p, "md-detailhelp");
                allClosed = allchildrenclosedexcept(p, "md-detailhelp");
                // Are all grand children (md-itemhide) opened?
                if (allOpened) {
                    allOpened = allgrandchildrenopened(p);
                }
                // window.alert(allOpened)
                // window.alert(allClosed)
                // Set new display variable. If one or more element but 
                // not all are open, open all elements. Otherwise, close
                // all elements if all of them are open. Also add + or -
                // to master title text.
                newdisplay = "block";
                if ((allOpened) && (!allClosed)) {
                    newdisplay = "none";
                    elem.innerHTML = "+" + elem.innerHTML.substring(1, elem.innerHTML.length);
                } else {
                    elem.innerHTML = "-" + elem.innerHTML.substring(1, elem.innerHTML.length);
                }
                // Loop through child nodes, find md-detailhide and md-itemhide elements
                // and set their style.display to value of newdisplay variable. The newdisplay
                // variable has a value of either "block" or "none". This value is based on the
                // current display condition of all md-detailhide and md-detailshow elements. If they
                // are currently all opened, then newdisplay is set to "none" so that they will all close.
                // If they are all closed, then the newdisplay value is "block" so that they all will
                // open. If some are opened and closed, the assumption is the user wants to open
                // all elements so the newdisplay value is "block". Once all opened, if user intended to
                // close them, they will close when the user natually clicks element again.			
                for (i = 0; i < p.childNodes.length; i += 1) {
                    c = p.childNodes[i];
                    if (c.className === "md-detailhide") {
                        // hide or show md-detailhide element
                        c.style.display = newdisplay;
                    } else if (c.className === "md-detailshow") {
                        // make sure md-detailshow is always shown because user could have previously closed it
                        c.style.display = "block";
                    } else if (c.className === "md-detailhelp") {
                        // make sure md-detailhelp is always not shown
                        c.style.display = "none";
                    }
                    for (j = 0; j < c.childNodes.length; j += 1) {
                        gc = c.childNodes[j];
                        if (gc.className === "md-itemhide") {
                            // hide or show md-itemhide element
                            gc.style.display = newdisplay;
                        } else if (gc.className === "md-itemshow") {
                            // show md-itemshow element
                            gc.style.display = "block";
                        }
                        for (k = 0; k < gc.childNodes.length; k += 1) {
                            ggc = gc.childNodes[k];
                            if (ggc.className === "md-itemhide") {
                                // hide or show md-itemhide element
                                ggc.style.display = newdisplay;
                            } else if (ggc.className === "md-itemshow") {
                                // show md-itemshow element
                                ggc.style.display = "block";
                            }
                            for (l = 0; l < ggc.childNodes.length; l += 1) {
                                gggc = ggc.childNodes[l];
                                if (gggc.className === "md-itemhide") {
                                    // hide or show md-itemhide element
                                    gggc.style.display = newdisplay;
                                } else if (gggc.className === "md-itemshow") {
                                    // show md-itemshow element
                                    gggc.style.display = "block";
                                }
                                for (m = 0; m < gggc.childNodes.length; m += 1) {
                                    ggggc = gggc.childNodes[m];
                                    if (ggggc.className === "md-itemhide") {
                                        // hide or show md-itemhide element
                                        ggggc.style.display = newdisplay;
                                    } else if (ggggc.className === "md-itemshow") {
                                        // show md-itemshow element
                                        ggggc.style.display = "block";
                                    }
                                }
                            }
                        }
                    }
                }
            }
            // Prevent event from bubbling past this event handler.
            evt.cancelBubble = true;
        }
    }

    // "md-mastertitle" onmouseover and onmouseout function
    function overmaster(evt) {
        // Get reference to W3C or IE event object
        evt = evt || ((window.event) ? event : null);
        if (evt) {
            // Get reference to element from which event object was created. W3C calls this element target. IE calls it srcElement.
            var elem = evt.target || evt.srcElement;
            if (elem.nodeType === 3) {
                // If W3C and element is text node (nodeType = 3), then get reference to container (parent) to equalize with IE event model.
                elem = elem.parentNode;
            }
            if (elem) {
                // Work with element.
                if (elem.className === "md-mastertitle") {
                    elem.className = "md-mastertitleover";
                } else if (elem.className === "md-mastertitleover") {
                    elem.className = "md-mastertitle";
                }
            }
            // Prevent event from bubbling past this event handler.
            evt.cancelBubble = true;
        }
    }

    // "md-detailtitle" onclick function. Opens and closes md-detailhide and md-detailshow elements.
    function clickdetail(evt) {
        var elem, p;
        // Get reference to W3C or IE event object
        evt = evt || ((window.event) ? event : null);
        if (evt) {
            // Get reference to element from which event object was created. W3C calls this element target. IE calls it srcElement.
            elem = evt.target || evt.srcElement;
            if (elem.nodeType === 3) {
                // If W3C and element is text node (nodeType = 3), then get reference to container (parent) to equalize with IE event model.
                elem = elem.parentNode;
            }
            if (elem) {
                // Work with element.
                p = elem.parentNode.nextSibling; // parent's next sibling element
                if (getcomputeddisplay(p) === "none") {
                    p.style.display = "block";
                } else {
                    p.style.display = "none";
                }
            }
            // Prevent event from bubbling past this event handler.
            evt.cancelBubble = true;
        }
    }

    // "md-detailtitle" onmouseover and onmouseout function
    function overdetail(evt) {
        // Get reference to W3C or IE event object
        evt = evt || ((window.event) ? event : null);
        if (evt) {
            // Get reference to element from which event object was created. W3C calls this element target. IE calls it srcElement.
            var elem = evt.target || evt.srcElement;
            if (elem.nodeType === 3) {
                // If W3C and element is text node (nodeType = 3), then get reference to container (parent) to equalize with IE event model.
                elem = elem.parentNode;
            }
            if (elem) {
                // Work with element.
                if (elem.className === "md-detailtitle") {
                    elem.className = "md-detailtitleover";
                } else if (elem.className === "md-detailtitleover") {
                    elem.className = "md-detailtitle";
                }
            }
            // Prevent event from bubbling past this event handler.
            evt.cancelBubble = true;
        }
    }

    // "md-itemlist" onmouseover and onmouseout function
    function overitemlist(evt) {
        // Get reference to W3C or IE event object
        evt = evt || ((window.event) ? event : null);
        if (evt) {
            // Get reference to element from which event object was created. W3C calls this element target. IE calls it srcElement.
            var elem = evt.target || evt.srcElement;
            if (elem.nodeType === 3) {
                // If W3C and element is text node (nodeType = 3), then get reference to container (parent) to equalize with IE event model.
                elem = elem.parentNode;
            }
            if (elem) {
                // Work with element.
                if (elem.className === "md-itemlist") {
                    elem.className = "md-itemlistover";
                } else if (elem.className === "md-itemlistover") {
                    elem.className = "md-itemlist";
                }
            }
            // Prevent event from bubbling past this event handler.
            evt.cancelBubble = true;
        }
    }

    // "md-item" onmouseover and onmouseout function
    function overitem(evt) {
        // Get reference to W3C or IE event object
        evt = evt || ((window.event) ? event : null);
        if (evt) {
            // Get reference to element from which event object was created. W3C calls this element target. IE calls it srcElement.
            var elem = evt.target || evt.srcElement;
            if (elem.nodeType === 3) {
                // If W3C and element is text node (nodeType = 3), then get reference to container (parent) to equalize with IE event model.
                elem = elem.parentNode;
            }
            if (elem) {
                // Work with element.
                if (elem.className === "md-item") {
                    elem.className = "md-itemover";
                } else if (elem.className === "md-itemover") {
                    elem.className = "md-item";
                }
            }
            // Prevent event from bubbling past this event handler.
            evt.cancelBubble = true;
        }
    }

    // "md-bgraphic" onmouseover and onmouseout function
    function overbgraphic(evt) {
        // Get reference to W3C or IE event object
        evt = evt || ((window.event) ? event : null);
        if (evt) {
            // Get reference to element from which event object was created. W3C calls this element target. IE calls it srcElement.
            var elem = evt.target || evt.srcElement;
            if (elem.nodeType === 3) {
                // If W3C and element is text node (nodeType = 3), then get reference to container (parent) to equalize with IE event model.
                elem = elem.parentNode;
            }
            if (elem) {
                // Work with element.
                if (elem.className === "md-bgraphic") {
                    elem.className = "md-bgraphicover";
                } else if (elem.className === "md-bgraphicover") {
                    elem.className = "md-bgraphic";
                }
            }
            // Prevent event from bubbling past this event handler.
            evt.cancelBubble = true;
        }
    }

    // "md-detailitem" onclick function. Opens and closes nextsibling md-itemhide or md-itemshow element.
    function clickitem(evt) {
        var elem, elemNext;
        // Get reference to W3C or IE event object
        evt = evt || ((window.event) ? event : null);
        if (evt) {
            // Get reference to element from which event object was created. W3C calls this element target. IE calls it srcElement.
            elem = evt.target || evt.srcElement;
            if (elem.nodeType === 3) {
                // If W3C and element is text node (nodeType = 3), then get reference to container (parent) to equalize with IE event model.
                elem = elem.parentNode;
            }
            if (elem) {
                // Work with element.
                elemNext = elem.nextSibling; // next sibling element
                if ((elemNext.className === "md-itemhide") || (elemNext.className === "md-itemshow")) {
                    if (getcomputeddisplay(elemNext) === "none") {
                        elemNext.style.display = "block";
                    } else {
                        elemNext.style.display = "none";
                    }
                }
            }
            // Prevent event from bubbling past this event handler.
            evt.cancelBubble = true;
        }
    }

    // "md-detailitemlist" onclick function. Opens and closes all children and all grand children md-itemhide and md-itemshow elements.
    function clickitemlist(evt) {
        var elem, elemNext, i, c, allOpened = true, allClosed = true, newdisplay = "block";
        // Get reference to W3C or IE event object
        evt = evt || ((window.event) ? event : null);
        if (evt) {
            // Get reference to element from which event object was created. W3C calls this element target. IE calls it srcElement.
            elem = evt.target || evt.srcElement;
            if (elem.nodeType === 3) {
                // If W3C and element is text node (nodeType = 3), then get reference to container (parent) to equalize with IE event model.
                elem = elem.parentNode;
            }
            if (elem) {
                // Work with element.
                elemNext = elem.nextSibling; // next sibling element
                // Next sibling is normally md-itemshow class, but if md-itemhide
                // class then hide or show it.
                if (elemNext.className === "md-itemhide") {
                    if (getcomputeddisplay(elemNext) === "none") {
                        elemNext.style.display = "block";
                    } else {
                        elemNext.style.display = "none";
                    }
                }
                // Are all grand children open or are all children closed?
                allOpened = allchildrenopenedexcept(elemNext, "md-item");
                allClosed = allchildrenclosedexcept(elemNext, "md-item");
                if ((allOpened) && (!allClosed)) {
                    newdisplay = "none";
                }
                // if they're all opened, close them. Otherwise, open all of them.
                for (i = 0; i < elemNext.childNodes.length; i += 1) {
                    c = elemNext.childNodes[i];
                    if (c.className === "md-itemhide") {
                        // hide or show md-itemhide
                        c.style.display = newdisplay;
                    } else if (c.className === "md-itemshow") {
                        // make sure md-itemshow is always shown
                        c.style.display = "block";
                    }
                }
            }
            // Prevent event from bubbling past this event handler.
            evt.cancelBubble = true;
        }
    }

    // "md-bgraphic" onclick function. Opens and closes browsegraphic images (jpg, jpeg, gif, png, bmp).
    function clickbgraphic(evt) {
        var elem, p, elemImage, srcImage;
        // Get reference to W3C or IE event object
        evt = evt || ((window.event) ? event : null);
        if (evt) {
            // Get reference to element from which event object was created. W3C calls this element target. IE calls it srcElement.
            elem = evt.target || evt.srcElement;
            if (elem.nodeType === 3) {
                // If W3C and element is text node (nodeType = 3), then get reference to container (parent) to equalize with IE event model.
                elem = elem.parentNode;
            }
            if (elem) {
                // Work with element.
                p = elem.parentNode.nextSibling;  // parent's next sibling element
                if (getcomputeddisplay(p) === "none") {
                    elemImage = p.childNodes[0];
                    srcImage = elem.getAttributeNode("browsen").value;
                    p.style.display = "block";
                    elemImage.setAttribute("src", srcImage);
                    elemImage.setAttribute("alt", "Image - " + srcImage);
                } else {
                    p.style.display = "none";
                }
            }
        }
    }


    // Assign event handler functions to md-mastertitle, md-detailtitle, md-item, md-itemlist, and md-bgraphic elements
    function setupmaster(elem) {
        if (elem) {
            var c, gc, ggc, gggc, ggggc, gggggc, i, j, k, l, m, n, o;

            for (i = 0; i < elem.childNodes.length; i += 1) {
                c = elem.childNodes[i];
                for (j = 0; j < c.childNodes.length; j += 1) {
                    gc = c.childNodes[j];
                    if (gc.className === "md-mastertitle") {
                        gc.onclick = clickmaster;
                        gc.onmouseover = overmaster;
                        gc.onmouseout = overmaster;
                        // begin name with + symbol to indicate clicking it can open/close content
                        // gc.innerHTML = "+ " + gc.innerHTML;
                    }
                    for (k = 0; k < gc.childNodes.length; k += 1) {
                        ggc = gc.childNodes[k];
                        if (ggc.className === "md-detailtitle") {
                            ggc.onclick = clickdetail;
                            ggc.onmouseover = overdetail;
                            ggc.onmouseout = overdetail;
                        }
                        if (ggc.className === "md-item") {
                            ggc.onclick = clickitem;
                            ggc.onmouseover = overitem;
                            ggc.onmouseout = overitem;
                        }
                        if (ggc.className === "md-itemlist") {
                            ggc.onclick = clickitemlist;
                            ggc.onmouseover = overitemlist;
                            ggc.onmouseout = overitemlist;
                        }
                        for (l = 0; l < ggc.childNodes.length; l += 1) {
                            gggc = ggc.childNodes[l];
                            if (gggc.className === "md") {
                                for (m = 0; m < gggc.childNodes.length; m += 1) {
                                    ggggc = gggc.childNodes[m];
                                    if (ggggc.className === "md-bgraphic") {
                                        ggggc.onclick = clickbgraphic;
                                        ggggc.onmouseover = overbgraphic;
                                        ggggc.onmouseout = overbgraphic;
                                    }
                                }
                            }
                            if (gggc.className === "md-item") {
                                gggc.onclick = clickitem;
                                gggc.onmouseover = overitem;
                                gggc.onmouseout = overitem;
                            }
                            if (gggc.className === "md-itemlist") {
                                gggc.onclick = clickitemlist;
                                gggc.onmouseover = overitemlist;
                                gggc.onmouseout = overitemlist;
                            }
                            for (n = 0; n < gggc.childNodes.length; n += 1) {
                                ggggc = gggc.childNodes[n];
                                if (ggggc.className === "md-item") {
                                    ggggc.onclick = clickitem;
                                    ggggc.onmouseover = overitem;
                                    ggggc.onmouseout = overitem;
                                }
                                if (ggggc.className === "md-itemlist") {
                                    ggggc.onclick = clickitemlist;
                                    ggggc.onmouseover = overitemlist;
                                    ggggc.onmouseout = overitemlist;
                                }
                                for (o = 0; o < ggggc.childNodes.length; o += 1) {
                                    gggggc = ggggc.childNodes[o];
                                    if (gggggc.className === "md-item") {
                                        gggggc.onclick = clickitem;
                                        gggggc.onmouseover = overitem;
                                        gggggc.onmouseout = overitem;
                                    }
                                    if (gggggc.className === "md-itemlist") {
                                        gggggc.onclick = clickitemlist;
                                        gggggc.onmouseover = overitemlist;
                                        gggggc.onmouseout = overitemlist;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // Assign event handler functions to taxonomy classification elements
    function setuptaxonomy(elem) {
        while (elem) {
            elem.onclick = clickitem;
            elem.onmouseover = overitem;
            elem.onmouseout = overitem;
            elem.id = "";
            elem = document.getElementById("tax");
        }
    }

    /* Add text - This function adds text to (inside) DIV element, but before doing so 
    searches for strings in the text that resemble URLs and converts them to hypertext
    elements and adds them to the div element as well. Searches for strings that begin 
    with "://" or "www." and converts them to <a href> elements. Add text function is 
    called by fixvalue function */
    function addtext(elem, txt) {
        // Scan entire text value and test for presense of URL strings, 
        // convert URL strings to Hypertext Elements, convert text strings
        // between URL strings to Text Nodes and append all Hypertext
        // Elements and Text Nodes to DIV element.
        var start = 0, end = 0, url = "", urlpattern, punctuation, result, elemText, fullurl, protocol, lastchar, nexttolastchar, elemAnchor;
        urlpattern = /(\w+):\/\/([\w.]+)((\S)*)|www\.([\w.]+)((\S)*)/g;
        punctuation = /[\.\,\;\:\?\!\[\]\(\)\{\}\'\"]/;
        while ((result = urlpattern.exec(txt)) !== null) {
            fullurl = result[0];
            protocol = result[1];
            url = fullurl;
            end = result.index;
            if (start < end) {
                // Append Text Node to parent
                elemText = document.createTextNode(txt.substring(start, end));
                elem.appendChild(elemText);
            }
            lastchar = fullurl.charAt(fullurl.length - 1);
            // Remove last character from url if character is punctuation mark, bracket or parenthesis;
            if (lastchar.match(punctuation) !== null) {
                // Remove next-to-last character from url if character is punctuation mark, bracket or parenthesis. For example the ")" in "),"
                nexttolastchar = fullurl.charAt(fullurl.length - 2);
                if (nexttolastchar.match(punctuation) !== null) {
                    url = fullurl.substring(0, fullurl.length - 2);
                } else {
                    url = fullurl.substring(0, fullurl.length - 1);
                }
            }
            start = (result.index + url.length);
            // Test to concatinate 'http://' to url if not already begininng with 'http://', 'https://' or 'ftp://'"
            if (protocol === "") {
                url = "http://" + url;
            }
            // Append Hypertext (anchor) Element to parent
            elemText = document.createTextNode(url);
            elemAnchor = document.createElement("A");
            elemAnchor.setAttribute("href", url);
            elemAnchor.setAttribute("target", "viewer");
            elemAnchor.appendChild(elemText);
            elem.appendChild(elemAnchor);
        }
        end = txt.length;
        if (start < end) {
            // Append Text Node that follows last Hypertext Element
            elemText = document.createTextNode(txt.substring(start, end));
            elem.appendChild(elemText);
        }
    }

    /* Fix value - Parse text in <pre> element to respect line breaks introduced in ArcCatalog
    by the metadata author who intentionally introduced single line breaks to start new lines
    or even more than one consecutive line break to further separate text to form paragraphs.
    Note, fixvalue() calls the addtext() function, which adds text to DIV elements, which are
    sequentially added to a parent DIV element to form separate lines and paragraphs of text. */

    function fixvalue(elem) {
        var n, val, pos, newline, par, prev, i, j, k, sValue, aValues, padBottom, add, div, label, nextValue;
        elem.id = "";
        val = String("");
        pos = Number(0);
        // Make a newline character to use for basis for splitting string into 
        // an array of strings that are processed and turned into separate div
        // elements with either new line or paragraphic-like style.
        newline = String.fromCharCode(10);
        par = elem.parentNode;
        if (elem.innerText) {
            // Position of first newline character in IE
            n = elem;
            val = n.innerText;
            pos = val.indexOf(newline);
        } else {
            // Position of first newline character in NS, Firefox
            n = elem.childNodes[0];
            val = n.nodeValue;
            pos = val.indexOf(newline);
        }
        if (pos > 0) {
            // Text string contains at least one white space character
            sValue = "";
            // Split entire text string value on newline character
            // in order to create an array of string values to process	
            aValues = val.split(newline);
            padBottom = Number(0);
            add = Boolean("false");
            // Loop thru each potential new line or paragraph and append <DIV>
            // element and set its className accordingly.
            for (i = 0; i <= aValues.length - 1; i += 1) {
                div = document.createElement("div");
                sValue = aValues[i];
                add = false;
                for (j = 0; j < sValue.length; j += 1) {
                    if (sValue.charCodeAt(j) > 32) {
                        add = true;
                        // window.alert("CHARACTER AT " + sValue.charAt(j) + " CHARCODE " + sValue.charCodeAt(j))
                        break;
                    }
                }
                if (add) {
                    if (i === 0) {
                        // Must clone and append label property (e.g. <b>Abstract</b>) to first <DIV>
                        // element, and then remove it from parent if at first element in aValues array.
                        prev = elem.previousSibling;
                        if (prev !== null) {
                            label = prev.cloneNode(true);
                            div.appendChild(label);
                            par.removeChild(prev);
                        }
                    }
                    // Now test to see whether to set style.paddingBottom to 0 or 4 for newline or 
                    // paragraph, respectively.  Look ahead and if all characters in the next element 
                    // in the aValues array (the next DIV element to make) are not white space then set
                    // style.paddingBottom = 0. Otherwise, set style.paddingBottom = 4 to separate the 
                    // the current <DIV> from the next <DIV> element.
                    padBottom = Number(0);
                    if (i < aValues.length - 1) {
                        // Assume paragraph-like separation between DIV elements
                        padBottom = Number(4);
                        // Look for non-white space characters in content for next DIV
                        nextValue = aValues[i + 1];
                        for (k = 0; k < nextValue.length; k += 1) {
                            if (nextValue.charCodeAt(k) > 32) {
                                // Found a non-white space character
                                padBottom = Number(0);
                                // window.alert("CHARACTER AT " + nextval.charAt(k) + " CHARCODE " + nextval.charCodeAt(k))
                                break;
                            }
                        }
                    }
                    // Pad element
                    div.style.paddingLeft = 0;
                    div.style.paddingRight = 0;
                    div.style.paddingTop = 0;
                    div.style.paddingBottom = padBottom;
                    // Scan text for URL strings before adding text to div element
                    addtext(div, sValue);
                    // Add new div element to parent div element
                    par.appendChild(div);
                }
            }
            par.removeChild(elem);
        } else {
            // No white space charaters in text string so can be added directly to parent DIV element.
            par.removeChild(elem);
            // Scan text for URL strings before adding text to div element
            addtext(par, val);
        }
    }

    // Onload function assigns event handler functions to DIV elements according to className
    function onLoadHandler() {
        var elem = document.getElementById("md-body");
        // Remove white space text nodes in Netscape 7 and Mozilla Firefox in order to 
        // use same set of javascript functions that work in IE to navigate through HTML.
        removewhitespace(elem);
        // Assign event handler functions to children of md-title element
        elem = document.getElementById("md-title");
        setuptitle(elem);
        // Assign event handler functions to md-clickdef element
        elem = document.getElementById("md-clickdef");
        setupclickdef(elem);
        // Assign event handler functions to children of md-menu element
        elem = document.getElementById("md-menu");
        setupmenu(elem);
        // Assign event handler functions md-mastertitle, md-detailtitle, md-item, md-itemlist, and md-bgraphic elements
        elem = document.getElementById("md-description");
        setupmaster(elem);
        elem = document.getElementById("md-graphic");
        setupmaster(elem);
        elem = document.getElementById("md-spatial");
        setupmaster(elem);
        elem = document.getElementById("md-structure");
        setupmaster(elem);
        elem = document.getElementById("md-quality");
        setupmaster(elem);
        elem = document.getElementById("md-source");
        setupmaster(elem);
        elem = document.getElementById("md-distribution");
        setupmaster(elem);
        elem = document.getElementById("md-metadata");
        setupmaster(elem);
        elem = document.getElementById("tax");
        setuptaxonomy(elem);
        /* Parse Text - Find each <pre> element with an Id="fixvalue" and
        call fixvalue() function to parse text to respect line breaks,
        replace <pre> element with <div> elememt, and convert URL address
        strings in text to <a href> element. */
        $(".fixvalue").each(function (index, elem) {
            fixvalue(elem);
        });
        window.focus();
    }

    window.onload = onLoadHandler;


}(jQuery));