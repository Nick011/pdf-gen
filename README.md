PDF-GEN
=====================


A web service for generating PDFs from HTML.

*** Example:
```
<!doctype HTML>
<html>
<head>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script>
<script type="text/javascript" src="(YOUR PDF-GEN DOMAIN)/javascripts/pdf_print.js"></script>
<script>
$(function() {
  // print function
  var token = 'DAL2J02NR2843N3BP3S8049NZQ4U292NN22393RH2380R23'
  $('.print_button').pdfPrint(token);
  $('.print_button').on('mouseup', function() {
    $(this).html('Loading...');
  });
});
</script>
</head>
<body>
  <h1>HELLO PDF!</h1>
  <p>This is some html content converted to pdf!</p>
  <button class=".print_button">PRINT</button>
</body>
```

