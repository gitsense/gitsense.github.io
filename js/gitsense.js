var gitsense = {
    init: function() {
        $ = jQuery.noConflict();
    },
    howItWorks: function(states) {
        var prefix          = "how-it-works",
            stateToImages   = {},
            stateToImageIdx = {},
            captionBody     = document.getElementById(prefix+"-caption"),
            captionText     = document.getElementById(prefix+"-caption-text"),
            clickedCaption  = false,
            i;

        for ( i = 0; i < states.length; i++ )
            initState(states[i]);

        function initState(state) {
            var body = document.getElementById(prefix+"-body-"+state),
                dots = document.getElementById("dots"),
                kids = body.children,
                imgs = [],
                kid,
                i;

            for ( i = 0; i < kids.length; i++ ) {
                kid = kids[i];

                if ( kid.tagName.toLowerCase() !== "img" )
                    continue;

                imgs.push(kid);

                if ( i !== 0 )
                    kid.style.display = "none";

                addDot(i, kid);
            }

            stateToImages[state]   = imgs;
            stateToImageIdx[state] = 0;

            updateCaption(state);

            var prev = document.getElementById(prefix+"-caption-nav-prev"),
                next = document.getElementById(prefix+"-caption-nav-next");

            captionBody.onclick = function() { 
                clickedCaption = true; 

                setTimeout(function(){ clickedCaption = false; }, 200)
            };

            body.onclick = clickedNext;
            next.onclick = clickedNext;
            prev.onclick = clickedPrev;

            function addDot(i, img) {
                var dot = document.createElement("span");

                dot.setAttribute("class", "octicon octicon octicon-primitive-dot");

                dot.style.marginLeft = "10px";
                dot.style.fontSize   = "20px";
                dot.style.cursor     = "pointer";
                dot.style.color      = i === 0 ? "#666" : "#ddd";

                dots.appendChild(dot);

                img.dot = dot;

                dot.onclick = function() { clickedNext(i); }
            }
            
            function clickedNext(clicked) {
                if ( clickedCaption )
                    return;

                var idx    = stateToImageIdx[state],
                    images = stateToImages[state],
                    newIdx;

                if ( typeof(clicked) === "number" ) {
                    newIdx = clicked;
                } else {
                    if ( idx + 1 === images.length )
                        newIdx = 0;
                    else
                        newIdx = idx + 1;
                }

                images[idx].dot.style.color    = "#ccc";
                images[newIdx].dot.style.color = "#666";

                stateToImageIdx[state] = newIdx;

                updateImage(state, images[idx], images[newIdx]);
            }

            function clickedPrev() {
                var idx    = stateToImageIdx[state],
                    images = stateToImages[state],
                    newIdx;

                if ( idx - 1 < 0 )
                    newIdx = images.length - 1;
                else
                    newIdx = idx - 1;

                images[idx].dot.style.color    = "#ccc";
                images[newIdx].dot.style.color = "#666";

                stateToImageIdx[state] = newIdx;

                updateImage(state, images[idx], images[newIdx]);
            }
        }

        function changedState(selectedState) {
            var images,
                state,
                toggle,
                body,
                img,
                i;

            for ( i = 0; i < states.length; i++ ) {
                state  = states[i];
                toggle = document.getElementById(prefix+"-toggle-"+state);
                body   = document.getElementById(prefix+"-body-"+state);

                if ( state === selectedState ) {
                    toggle.setAttribute("class", "toggle toggle-active-"+state);
                    $(body).show();
                } else {
                    toggle.setAttribute("class", "toggle toggle-inactive");
                    $(body).hide();
                }
            }

            if ( selectedState === "off" ) {
                $(captionBody).hide();
                return;
            }
    
            updateCaption(selectedState);
        }

        function updateCaption(state, fadeIn) {
            var idx   = stateToImageIdx[state],
                image = stateToImages[state][idx],
                text  = image.attributes["data-caption"].nodeValue;

            if ( fadeIn === undefined ) 
                fadeIn = true;

            $(captionText).html(text);

            if ( fadeIn )
                $(captionBody).fadeIn();
        }

        function updateImage(state, oldImage, newImage) {
            $(captionBody).hide();

            updateCaption(state, false);

            $(captionBody).show();

            $(oldImage).fadeOut(
                null,
                function(){
                    $(newImage).fadeIn();
                }
            );
        }
    }
};
