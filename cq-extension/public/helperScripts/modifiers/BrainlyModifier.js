(function() {
    if(window.BrainlyModifier) return;
    
    window.BrainlyModifier = class BrainlyModifier extends Modifier {
        
        get elements() {
            return [
                {
                    className: '.sg-actions-list__hole.sg-actions-list__hole--to-end'
                },
                {
                    className: '.brn-verified-info-box__header'
                }, 
                {
                    className: '.brn-answer__header.sg-content-box__title .sg-breadcrumb-list .sg-breadcrumb-list__element',
                    filter: function(elements) {
                        return [...elements].filter((element, index) => index % 2 === 1);
                    }
                }
            ];
        }

    }

})();