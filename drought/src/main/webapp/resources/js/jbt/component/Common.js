/**
 * 
 */
String.prototype.isBlank = function() {
	return (!this || /^\s*$/.test(this));
};

String.prototype.isEmpty = function() {
	return (this.length === 0 || !this.trim());
};

function objClone(obj) {
	if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

