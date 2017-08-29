# Mt. Washington Improvement Association: PayPal

[![Solution Graphics](https://www.paypal.com/en_US/i/bnr/horizontal_solution_PPeCheck.gif)][0]

  
You can now pay your MWIA dues right here online with any major credit or debit card, or a 
PayPal account. All payments are securely processed by PayPal.

Membership dues for calendar year 2014 are:

<table style="margin-left:2em; margin-bottom:1.2em">
   <tr><td style="width:150px">First time members</td><td>$19</td></tr>
   <tr><td>Renewing members</td><td>$40</td></tr>
   <tr><td>Sponsoring members</td><td>$100</td></tr>
</table>

First we need to get some information about you. Please fill out the 
following form and press "Continue". (All fields are required.)

<form action="" method="post">
	<table cellpadding="0" cellspacing="5">
	<tr><td><b>Name</b><br><input type="text" size="40" name="name" onkeypress="setBtnState()"></td></tr><tr><td><b>Address</b><br><input type="text" size="40" name="address" onkeypress="setBtnState()"></td></tr><tr><td><b>Phone</b><br><input type="text" size="40" name="phone" onkeypress="setBtnState()"></td></tr><tr><td><b>Email</b><br><input type="text" size="40" name="email" onkeypress="setBtnState()"></td></tr>		<tr><td><b>Interested in volunteering with the MWIA?</b><br>
			Yes <input type="radio" name="volunteer" value="yes" onclick="setBtnState()">&nbsp;&nbsp;&nbsp;
			No <input type="radio" name="volunteer" value="no" onclick="setBtnState()"></td></tr>
		<tr><td colspan="2" align="right"><input type="submit" name="submit" value="Continue" disabled></td></tr>
	</table>
</form>
	
<script type="text/javascript">
		window.onload = document.forms[0].elements[0].select();
		function setBtnState() {	
			var d = true;
			var f = document.forms[0];	
			d = (f.name.value == "") || (f.address.value == "") || (f.phone.value == "") || (f.email.value == "") || ((!f.volunteer[0].checked) && (!f.volunteer[1].checked)); 
			f.submit.disabled = d;
		}
</script>


[0]: #
