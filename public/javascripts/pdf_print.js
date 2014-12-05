(function() {
	var ie = (function(){
    var undef,
        v = 3,
        div = document.createElement('div'),
        all = div.getElementsByTagName('i');

    while (
        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
        all[0]
    );

    return v > 4 ? v : undef;
	}());

	//redirect to non https domain if using IE
	if (ie <= 9) {
		var qString = window.location.toString();
		var httpsIndex = qString.indexOf('https://');
		if (httpsIndex >=0) {
			window.location = qString.replace('https', 'http');
		}
	}


	$.fn.pdfPrint = function(token) {
		var src, url, server;
		$('script').each(function() {
			src = $(this).attr('src');
			var index = src.indexOf('javascripts/pdf_print.js');
			if (index >= 0) {
				server = src.substring(0, index);
				url = 'http:' + server + 'pdf/';
				return false;
			}
		});
		this.on('mousedown', function() {
			var pageUrl = window.location.toString();
			var doc = $('html').clone();
			doc.find('script').remove();
			doc = doc.html();
			doc = doc
							.replace(/é/ig, '&eacute;')
							.replace(/ó/ig, '&oacute;')
							.replace(/•/ig, '&bull;')
							.replace(/–/ig, '&ndash;');

			var data = {
				doc: doc,
				token: token
			};

			//FUCK YOU MICROSOFT
			if (ie > 9 || isNaN(ie)) {
				$.ajax({
					type: 'POST',
					url: url,
					data: data,
					dataType: 'json',
					crossDomain: true,
					success: function(res) {
						//alert(JSON.stringify(res));
						var pdfPath = url + res.url;
						window.location = pdfPath;
					},
					error: function(jqxhr, status) {
						alert('ajax error');
						alert(JSON.stringify(jqxhr));
					}
				});
			}
			else {
				var xdr = new XDomainRequest();
				xdr.timeout = 5000;
				xdr.onprogress = function() {
				};

				xdr.ontimeout = function() {
					alert('timeout');
				};

				xdr.onload = function() {
					//complete
					var data = $.parseJSON(xdr.responseText);
					var pdfPath = url + data.url;
					window.location = pdfPath;
				};

				xdr.onerror = function() {
					alert('error');
					alert(xdr.responseText);
				};

				xdr.open('post', url);
				xdr.send(JSON.stringify(data));
			}
			
		});
	};

}($));
