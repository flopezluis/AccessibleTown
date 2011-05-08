function getFormatedDate(pickerdate) {
    var day = pickerdate.getDate();
    day = day.toString();
 
    if (day.length < 2) {
        day = '0' + day;
 
    }

    var month = pickerdate.getMonth();
    month = month + 1;
    month = month.toString();
 
    if (month.length < 2) {
        month = '0' + month;
    }
 
    var year = pickerdate.getFullYear();
    return "" + day + "/" + month + "/" + year;
}

function trim (myString)
{
return myString.replace(/^\s+/g,'').replace(/\s+$/g,'')
}

/*
* It's used in send_initiative and preferences.js
*/
function deleteElement(fieldNonValidated, field) {
    for (var e = 0; e < fieldNonValidated.length; e++) {
        if (fieldNonValidated[e].id == field.id) {
            fieldNonValidated.splice(e,1);
            return;
        }
    }
}

/*
* It's used in send_initiative and preferences.js
*/
function addElement(fieldNonValidated, field) {
    for (var e = 0; e < fieldNonValidated.length; e++) {
        if (fieldNonValidated[e].id == field.id) {
            return;
        }
    }
    fieldNonValidated.push(field);
}

function changeAccentsToHtml(string) {
    string = string.replace(/ó/gi, "&oacute;")
    string = string.replace(/í/gi, "&iacute;")
    string = string.replace(/é/gi, "&eacute;")
    string = string.replace(/á/gi, "&aacute;")
    string = string.replace(/ú/gi, "&uacute;")
    return string;
}


