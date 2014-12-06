this["JST"] = this["JST"] || {};

this["JST"]["app/templates/cell.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<td class="cell" id="cell-' +
((__t = ( y )) == null ? '' : __t) +
'-' +
((__t = ( x )) == null ? '' : __t) +
'">\r\n\t<table class="table">\r\n\t\t<tbody>\r\n\t\t\t<tr class="row top">\r\n\t\t\t\t<td class="cell left"></td>\r\n\t\t\t\t<td class="cell center"></td>\r\n\t\t\t\t<td class="cell right"></td>\r\n\t\t\t</tr>\r\n\t\t\t<tr class="row center">\r\n\t\t\t\t<td class="cell left"></td>\r\n\t\t\t\t<td class="cell center"></td>\r\n\t\t\t\t<td class="cell right"></td>\r\n\t\t\t</tr>\r\n\t\t\t<tr class="row bottom">\r\n\t\t\t\t<td class="cell left"></td>\r\n\t\t\t\t<td class="cell center"></td>\r\n\t\t\t\t<td class="cell right"></td>\r\n\t\t\t</tr>\r\n\t\t</tbody>\r\n\t</table>\r\n</td>\r\n';

}
return __p
};

this["JST"]["app/templates/row.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<tr class="row" id="row-' +
((__t = ( y )) == null ? '' : __t) +
'"></tr>';

}
return __p
};