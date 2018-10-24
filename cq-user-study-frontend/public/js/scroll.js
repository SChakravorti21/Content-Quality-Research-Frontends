(function() {
    const debounce = (fn, time) => {
        let timeout = null;
        return function() {
            let functionCall = () => fn.apply(this, arguments);
            clearTimeout(timeout);
            timeout = setTimeout(functionCall, time);
        }
    };

    const scrollHandler = function (event) {
        const scrollElement = event.target.scrollingElement;
        const charts = document.querySelectorAll(".chart-wrapper");
        const scrollTop = scrollElement.scrollTop;

        charts.forEach(chart => {
            chart.style.top = scrollTop + 'px';
        });
    };

    window.addEventListener('scroll', debounce(scrollHandler, 10));
})();