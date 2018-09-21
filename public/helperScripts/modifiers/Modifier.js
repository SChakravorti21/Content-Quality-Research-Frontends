(function() {
    if(window.Modifier) return;
    
    window.Modifier = class Modifier {
        
        constructor() {
            if(this.elements === undefined)
                throw new Error("Elements to remove must be defined");
        }

        modifyPageSource() {
            this.elements.forEach(element => this.removeElement(element));
        }

        removeElement(elementProperties) {
            let targetElements = document.querySelectorAll(elementProperties.className);
            
            if(elementProperties.filter)
                targetElements = elementProperties.filter(targetElements);
            
            targetElements.forEach(element => {
                element.parentNode.removeChild(element);
            });
        }
    }

})();