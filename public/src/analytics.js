// Analytics - Plausible. Cookieless, so there is no consent banner to add, and
// nothing here identifies an individual visitor.
//
// This file is the only place analytics is configured. Every page loads it with
// one deferred <script> tag, so changing provider, or pasting in a new Plausible
// snippet, is a one-file edit rather than a six-page find-and-replace.
//
// What gets measured
//   Page views               automatic
//   File Download            automatic - the resume PDF (pdf is in Plausible's
//                            default download list)
//   Outbound Link: Click     automatic - GitHub, LinkedIn, any link off-site
//   Contact Click            below - mailto: links, which the outbound-links
//                            extension does not count as outbound
//   Read 50% / Read 90%      below - how far visitors actually get through a
//                            post. Views alone cannot tell a read from a
//                            bounce; filter these two by page to see which
//                            post is working.
//
// Each of those five has to be added once as a goal under Site Settings > Goals
// in Plausible, otherwise it is collected but never charted.
//
// Read depth uses two separate goal names instead of one goal with a `depth`
// property because custom properties are a paid add-on; plain goals work on
// every plan.
//
// Plausible ignores localhost, so testing locally will not skew the numbers.

(function () {
    'use strict';

    var DOMAIN = 'vikky2810.github.io';
    var SRC = 'https://plausible.io/js/script.file-downloads.outbound-links.js';

    // Stub so events fired before the remote script lands are queued, not lost.
    window.plausible = window.plausible || function () {
        (window.plausible.q = window.plausible.q || []).push(arguments);
    };

    var tag = document.createElement('script');
    tag.defer = true;
    tag.src = SRC;
    tag.dataset.domain = DOMAIN;
    document.head.appendChild(tag);

    // mailto: links - the hero icon, the about card and the contact row.
    document.addEventListener('click', function (event) {
        var target = event.target;
        if (target && target.closest && target.closest('a[href^="mailto:"]')) {
            window.plausible('Contact Click');
        }
    });

    // Read depth, blog posts only. .blog-content is the post body itself, so
    // the related-posts and author boxes below it do not count towards a read.
    var content = document.querySelector('.blog-content');
    if (!content) return;

    // Highest threshold first; each entry is cleared once it has fired.
    var steps = [[0.9, 'Read 90%'], [0.5, 'Read 50%']];
    var pending = false;

    function measure() {
        pending = false;

        var box = content.getBoundingClientRect();
        if (box.height <= 0) return;

        // Share of the post that has passed the bottom of the viewport.
        var progress = (window.innerHeight - box.top) / box.height;

        for (var i = steps.length - 1; i >= 0; i--) {
            if (steps[i][1] && progress >= steps[i][0]) {
                window.plausible(steps[i][1]);
                steps[i][1] = null;
            }
        }

        if (!steps[0][1]) {
            window.removeEventListener('scroll', onScroll);
        }
    }

    function onScroll() {
        if (!pending) {
            pending = true;
            window.requestAnimationFrame(measure);
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    measure();
})();
