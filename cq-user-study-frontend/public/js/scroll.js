(function() {
    window.addEventListener('scroll', function (event) {
        const scrollElement = event.target.scrollingElement;
        const charts = document.querySelectorAll(".chart-wrapper");
        const scrollTop = scrollElement.scrollTop;
        charts.forEach(chart => {
            chart.style.top = scrollTop + 'px';
        })
    });
})();