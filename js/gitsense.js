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
            i;

        for ( i = 0; i < states.length; i++ )
            initState(states[i]);

        function initState(state) {
            var kids   = document.getElementById(prefix+"-body-"+state).children,
                imgs   = [],
                kid,
                i;

            for ( i = 0; i < kids.length; i++ ) {
                kid = kids[i];

                if ( kid.tagName.toLowerCase() !== "img" )
                    continue;

                imgs.push(kid);

                if ( i !== 0 )
                    kid.style.display = "none";
            }

            stateToImages[state]   = imgs;
            stateToImageIdx[state] = 0;

            updateCaption(state);

            var prev = document.getElementById(prefix+"-caption-nav-prev"),
                next = document.getElementById(prefix+"-caption-nav-next");

            next.onclick = function() {
                var idx    = stateToImageIdx[state],
                    images = stateToImages[state],
                    newIdx;

                if ( idx + 1 === images.length )
                    newIdx = 0;
                else
                    newIdx = idx + 1;

                stateToImageIdx[state] = newIdx;

                updateImage(state, images[idx], images[newIdx]);
            }

            prev.onclick = function() {
                var idx    = stateToImageIdx[state],
                    images = stateToImages[state],
                    newIdx;

                if ( idx - 1 < 0 )
                    newIdx = images.length - 1;
                else
                    newIdx = idx - 1;

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
