(function() {
    if(window.WuFooModifier) return;
    
    window.WuFooModifier = class WuFooModifier {
        
        constructor() {
            this.fields = ["input#Field255", 
                           "input#Field256", 
                           "input#Field231", 
                           "input#Field243", 
                           "input#Field248", 
                           "input#Field127", 
                           "input#Field128"]

            this.values = ["Shoumyo", 
                           "Chakravorti", 
                           "Goonetilleke - Introduction to Linear Algebra", 
                           4, 
                           4, 
                           "shoumyo.chakravorti@rutgers.edu", 
                           "lcg71@math.rutgers.edu"]
        }

        insertValues() {
            this.fields.forEach((selector, index) => {
                let input = document.querySelector(selector);
                input.value = this.values[index];
            });
        }

    }

})();