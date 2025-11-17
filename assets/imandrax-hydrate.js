function imandrax_voronoi_styles() {
    return {
        logging: false,
        pixelRatio: window.devicePixelRatio || 1,
        wireFramePixelRatio: window.devicePixelRatio || 1,
        stacking: 'hierarchical',
        rainbowStartColor: 'hsla(162, 76%, 79%, 1)',
        rainbowEndColor: 'hsla(166, 78%, 80%, 1)',
        groupFillType: 'plain',
        parentFillOpacity: 0.1,
        parentLabelOpacity: 0.1,
        groupLabelMaxFontSize: 36,
        onGroupOpenOrCloseChanging: function (opts) {
            opts.group.open = opts.open;
        },
        groupLabelDecorator: function (opts, props, vars) {
            if (!props.group.region) {
                if (props.level == 0 || props.parent.open) {
                    vars.labelText = "Dbl click to zoom";
                } else {
                    vars.labelText = "";
                }
            }
        },
        onGroupMouseWheel: function (e) {
            e.allowOriginalEventDefault();
            e.preventDefault();
        },
        onGroupDrag: function (e) {
            // Prevent dragging only on touch devices
            if (('ontouchstart' in window)) {
                e.allowOriginalEventDefault();
                e.preventDefault();
            }
        },
        rolloutDuration: 0,
        exposeDuration: 0,
        openCloseDuration: 0,
        pullbackDuration: 0,
        fadeDuration: 0
    };
}

function hydrate (target) {
    var detailsSelector = target + ' .decompose-details';
    var dataStr = $(target + ' textarea').val();
    var data = JSON.parse(dataStr);
    var el = $(target + ' .decompose-foamtree')[0];
    var foamtree = new CarrotSearchFoamTree({element: el});
    foamtree.set(imandrax_voronoi_styles());
    foamtree.set({ dataObject: { groups: data.regions } });
    foamtree.set({ onGroupSelectionChanged: function (info) {
        if (!info.groups.length) {
            $(detailsSelector + ' .decompose-details-selection').addClass('hidden');
            $(detailsSelector + ' .decompose-details-no-selection').removeClass('hidden');

        } else {
            $(detailsSelector + ' .decompose-details-no-selection').addClass('hidden');
            $(detailsSelector + ' .decompose-details-selection').removeClass('hidden');

            var g = info.groups[0];

            var constraints = g.constraints.map(function (c) {
                return '<pre class="decompose-details-constraint">' + c + '</pre>';
            });

            $(detailsSelector + ' .decompose-details-constraints').html(constraints.join('\n'));
            $(detailsSelector + ' .decompose-details-direct-sub-regions-text').html(g.groups.length);
            $(detailsSelector + ' .decompose-details-contained-regions-text').html(g.weight);

            if (!g.region) {
                $(detailsSelector + ' .decompose-details-invariant').addClass('hidden');
            } else {
                $(detailsSelector + ' .decompose-details-invariant').removeClass('hidden');
                $(detailsSelector + ' .decompose-details-invariant-text').html(g.region.invariant);
            }
        }
    }});
}