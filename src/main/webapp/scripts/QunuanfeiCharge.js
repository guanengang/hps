<%@ page pageEncoding="UTF-8" %>
<script type="text/javascript">
var nowDateStr = '<fmt:formatDate value="${now}" type="both" dateStyle="long" pattern="yyyy-MM-dd" />';

$(function(){
});


function charge() {
	if ($('#chargeForm').form('validate')) {
		var recordId = $('#recordId').val();
		$('#chargeForm').form("submit", {
			url : "${ctx}/heatingcharge/" + recordId + "/actualCharge",
			success : function(data) {
				if (typeof data == "string") {
					var dataObj = $.parseJSON(data);  
					if (dataObj.error) {
						$.messager.alert('警告', dataObj.errorMsg);
						return;
					}
				}
				$('#chargeDialog').dialog('close');
				$('#data_grid').datagrid('reload');
				openPrintDialog(recordId);
			}
		});
	}
}

function openPrintDialog(recordId) {
	if (!recordId) {
		var selectedRow = $('#data_grid').datagrid('getSelected');
		if (selectedRow) {
			recordId = selectedRow.id;
		} else {
			$.messager.alert('警告','请选择记录');
			return;
		}
	}
	window.showModalDialog("${ctx}/QunuanfeiChargePrint",
			recordId, "dialogWidth=800px;dialogHeight=400px;status:no;center:yes");
}

function cancel() {
	if ($('#cancelChargeForm').form('validate')) {
		var recordId = $('#cancelRecordId').val();
		$('#cancelChargeForm').form("submit", {
			url : "${ctx}/heatingcharge/" + recordId + "/cancel",
			success : function(data) {
				if (typeof data == "string") {
					var dataObj = $.parseJSON(data);  
					if (dataObj.error) {
						$.messager.alert('警告', dataObj.errorMsg);
						return;
					}
				}
				$('#cancelDialog').dialog('close');
				$('#data_grid').datagrid('reload');
			}
		});
	}
}

function openChargeDialog(recordId) {
	if (!recordId) {
		var selectedRow = $('#data_grid').datagrid('getSelected');
		if (selectedRow) {
			recordId = selectedRow.id;
		} else {
			$.messager.alert('警告','请选择记录');
			return;
		}
	}
	setDialogData(recordId, false);
	$("#chargeBtn").show();
	$('#chargeDialog').dialog('open');
}

function openDetailDialog(recordId) {
	if (!recordId) {
		var selectedRow = $('#data_grid').datagrid('getSelected');
		if (selectedRow) {
			recordId = selectedRow.id;
		} else {
			$.messager.alert('警告','请选择记录');
			return;
		}
	}
	setDialogData(recordId, true);
	$("#chargeBtn").hide();
	$('#chargeDialog').dialog('open');
}

function openCancelDialog(recordId) {
	if (!recordId) {
		var selectedRow = $('#data_grid').datagrid('getSelected');
		if (selectedRow) {
			recordId = selectedRow.id;
		} else {
			$.messager.alert('警告','请选择记录');
			return;
		}
	}
	$('#cancelRecordId').val(recordId);
	$('#cancelledRemarks').val("");
	$('#cancelDialog').dialog('open');
}

function recordOnCheck(rowIndex,rowData) {
	$("#toolbarDetailBtn").linkbutton("enable");
	if (rowData.chargeState == g_chargestate_uncharged) { // 未缴费
		if (rowData.diverted) {
			$("#toolbarChargeBtn").linkbutton("disable");
		} else {
			$("#toolbarChargeBtn").linkbutton("enable");
		}
		$("#toolbarCancelBtn").linkbutton("disable");
		$("#toolbarPrintBtn").linkbutton("disable");
	} else if (rowData.chargeState == g_chargestate_charged) { // 已缴费
		$("#toolbarChargeBtn").linkbutton("disable");
		$("#toolbarCancelBtn").linkbutton("enable");
		$("#toolbarPrintBtn").linkbutton("enable");
	} else { // 已取消
		$("#toolbarChargeBtn").linkbutton("disable");
		$("#toolbarCancelBtn").linkbutton("disable");
		$("#toolbarPrintBtn").linkbutton("disable");
	}
}

function recordOnUncheck() {
//	$("#toolbarChargeBtn").linkbutton("disable");
//	$("#toolbarDetailBtn").linkbutton("disable");
//	$("#toolbarCancelBtn").linkbutton("disable");
}

function setDialogData(recordId, readOnly) {
	$.ajax({
		url: "${ctx}/heatingcharge/chargerecord/" + recordId, 
		success: function(data) {
			$('#recordId').val(data.id);
			if (data.chargeState == g_chargestate_charged) { // 已缴费
				$('#chargeDate').val(data.chargeDate);
			} else {
				$('#chargeDate').val(nowDateStr);
			}
			$('#divertedCharge').val(data.divertedCharge);
			$('#normalHeatingCharge').val(data.normalHeatingCharge);
			$('#preferential').val(data.preferential);
			$('#mustZhinajin').val(data.mustZhinajin);
			$('#zhinajinOn').removeProp("checked");
			$('#stopped').removeProp("checked");
			$('#livingSohard').removeProp("checked");
			if (data.chargeState == g_chargestate_charged) { // 已缴费
				if (data.zhinajinOn) {
					$('#zhinajinOn').prop("checked", "checked");
				}
				if (data.stopped) {
					$('#stopped').prop("checked", "checked");
				}
				if (data.livingSohard) {
					$('#livingSohard').prop("checked", "checked");
				}
			}
			$('#mustSumCharge').val(data.mustSumCharge);
			
			$('#paymentDateTitle').val(data.paymentDate.title);
			$('#chargeState').val(data.chargeState);
//			$('#payStartDate').val(data.paymentDate.payStartDate);
//			$('#payEndDate').val(data.paymentDate.payEndDate);
			$('#unit').val(data.unit.unit + "元/平米");
			$('#diverted').val(data.diverted ? "是" : "否");
			$('#expiredDays').val(data.expiredDays);
			$('#zhinajinRate').val(data.paymentDate.zhinajinRate * 1000 + "‰/日");
			$('#preferentialDesc').val(data.preferentialDesc);
			$('#divertedMsg').val(data.divertedMsg);
			$('#cancelled').val(data.cancelled ? "是" : "否");
			$('#stoppedRate').text(data.paymentDate.stopHeatingRate * 100);
			$('#livingSohardRate').text(data.paymentDate.livingSoHardRate * 100);
			
			$('#houseAddress').val(data.house.address);
			$('#yongfangXingzhi').val(data.house.yongfangXingzhi.name);
			$('#warmArea').val(data.house.warmArea + "平米");
			$('#ownerName').val(data.houseOwner.name);
			$('#shenfenXingzhi').val(data.house.shenfenXingzhi.name);
			$('#owerIdCardNo').val(data.houseOwner.idCardNo);
			$('#ownerPhone').val(data.houseOwner.phoneNo);
			$('#wageNum').val(data.wageNum);
			$('#operUserName').val(data.operUser.userName);
			$("#remarks").val(data.remarks);
			if (data.chargeState == g_chargestate_charged) { // 已缴费
				$("#actualSumCharge").numberbox("setValue", data.actualSumCharge.replace(",", ""));
			} else {
				var mustSumCharge = data.mustSumCharge.replace(",", ""); // 去除千位分隔符
				mustSumCharge = formatNummber(mustSumCharge, 1) + "0"; // 不收分钱
				$("#actualSumCharge").numberbox("setValue", readOnly ? "0" : mustSumCharge.replace(",", ""));
			}
			if (data.chargeState == g_chargestate_cancelled) { // 已取消
				// 此处其实应该有单独的字段作为取消时间以及取消人，为了简单，暂且使用记录的最后更改时间以及更改人
				$('#cancelledTime').val(data.lastUpdateTime);
				$('#cancelledUserName').val(data.lastUpdateUserName);
				$('#cancelledCause').val(data.cancelledCause);
			} else {
				$('#cancelledTime').val("");
				$('#cancelledUserName').val("");
				$('#cancelledCause').val("");
			}
		}});
}

function zhinajinOnClick() {
	var zhinajinOn = $('#zhinajinOn').prop("checked");
	if (zhinajinOn) {
		$('#stopped').removeProp("checked");
		$('#livingSohard').removeProp("checked");
	}
	var chargeState = $("#chargeState").val();
	if (chargeState != "未缴费") {
		return;
	}
	var zhinajin = $("#mustZhinajin").val().replace(",", "");
	if (zhinajin <= 0) {
		return;
	}
	if (zhinajinOn) { // 收取滞纳金
		var mustSum = $("#mustSumCharge").val().replace(",", "");
		mustSum = mustSum * 1 + zhinajin * 1;
		//$("#mustSumCharge").val(formatNummber(mustSum, 2));
		var actualSum = formatNummber(mustSum, 1) + "0"; // 不收分钱
		$("#actualSumCharge").numberbox("setValue", formatNummber(actualSum, 2).replace(",", ""));
	} else { // 不收滞纳金
		var mustSum = $("#mustSumCharge").val().replace(",", "");
//		mustSum -= zhinajin;
		//$("#mustSumCharge").val(formatNummber(mustSum, 2));
		var actualSum = formatNummber(mustSum, 1) + "0"; // 不收分钱
		$("#actualSumCharge").numberbox("setValue", formatNummber(actualSum, 2).replace(",", ""));
	}
}

function stoppedOnClick() {
	var chargeState = $("#chargeState").val();
	var stopped = $('#stopped').prop("checked");
	if (stopped) {
		$('#zhinajinOn').removeProp("checked");
		$('#livingSohard').removeProp("checked");
	}
	if (chargeState != "未缴费") {
		return;
	}
	if (stopped) {
		var normalHeatingCharge = $("#normalHeatingCharge").val().replace(",", "");
		var preferCharge = $("#preferential").val().replace(",", "");
		var getRate = 1 - preferCharge / normalHeatingCharge;
		var stopRate = $("#stoppedRate").text() / 100;
		var mustSumCharge = $("#mustSumCharge").val().replace(",", "");
		var mustSum = (mustSumCharge / getRate) * stopRate;
		//$("#mustSumCharge").val(formatNummber(mustSum, 2));
		var actualSum = formatNummber(mustSum, 1); // 不收分钱
		$("#actualSumCharge").numberbox("setValue", formatNummber(actualSum, 2).replace(",", ""));
	} else {
		var mustSumCharge = $("#mustSumCharge").val().replace(",", "");
//		var prefer = $("#preferential").val().replace(",", "");
//		var mustSum = normalHeatingCharge - prefer;
		//$("#mustSumCharge").val(formatNummber(mustSum, 2));
		var actualSum = formatNummber(mustSumCharge, 1); // 不收分钱
		$("#actualSumCharge").numberbox("setValue", formatNummber(actualSum, 2).replace(",", ""));
	}
}

function livingSohardOnClick() {
	var chargeState = $("#chargeState").val();
	var livingSohard = $('#livingSohard').prop("checked");
	if (livingSohard) {
		$('#zhinajinOn').removeProp("checked");
		$('#stopped').removeProp("checked");
	}
	if (chargeState != "未缴费") {
		return;
	}
	if (livingSohard) {
		var normalHeatingCharge = $("#normalHeatingCharge").val().replace(",", "");
		var preferCharge = $("#preferential").val().replace(",", "");
		var getRate = 1 - preferCharge / normalHeatingCharge;
		
		var mustSumCharge = $("#mustSumCharge").val().replace(",", "");
		var livingSohardRate = $("#livingSohardRate").text() / 100;
		var mustSum = (mustSumCharge / getRate) * livingSohardRate;
		//$("#mustSumCharge").val(formatNummber(mustSum, 2));
		var actualSum = formatNummber(mustSum, 1); // 不收分钱
		$("#actualSumCharge").numberbox("setValue", formatNummber(actualSum, 2).replace(",", ""));
	} else {
		var mustSumCharge = $("#mustSumCharge").val().replace(",", "");
//		var prefer = $("#preferential").val().replace(",", "");
//		var mustSum = normalHeatingCharge - prefer;
		//$("#mustSumCharge").val(formatNummber(mustSum, 2));
		var actualSum = formatNummber(mustSumCharge, 1); // 不收分钱
		$("#actualSumCharge").numberbox("setValue", formatNummber(actualSum, 2).replace(",", ""));
	}
}

function clearHeatingQuery() {
	//$('#base_q').combobox("select", COMBOBOX_DEFAULT_SEL_VAL);
	$('#area_q').combobox("select", COMBOBOX_DEFAULT_SEL_VAL);
	$('#louzuo_q').combobox("select", COMBOBOX_DEFAULT_SEL_VAL);
	$('#danyuan_q').val("");
	$('#louceng_q').val("");
	$('#ownerName_q').val("");
	$('#shenfenXingzhi_q').combobox("select", COMBOBOX_DEFAULT_SEL_VAL);
	$('#recordRemarks_q').val("");
	$('#paymentDateId_q').combobox("select", COMBOBOX_DEFAULT_SEL_VAL);
	$('#ownerNo_q').val("");
	$('#wageNum_q').val("")
	$('#yongfangXingzhi_q').combobox("select", COMBOBOX_DEFAULT_SEL_VAL);
	$('#chargeState_q').combobox("select", COMBOBOX_DEFAULT_SEL_VAL);
}

function setQueryParams(params) {
	if (!commonItemsInitialized()) {
		// 如果页面没有加载完，延迟一会儿再加载datagrid
		setTimeout(function() {
			$('#data_grid').datagrid('reload');
		}, 500);
		return false;
	}
	if ($('#base_q').combobox("getValue") != COMBOBOX_DEFAULT_SEL_VAL) {
		params.baseCode = $('#base_q').combobox("getValue");
	}
	if ($('#area_q').combobox("getValue") != COMBOBOX_DEFAULT_SEL_VAL) {
		params.areaCode = $('#area_q').combobox("getValue");
	}
	if ($('#louzuo_q').combobox("getValue") != COMBOBOX_DEFAULT_SEL_VAL) {
		params.louzuoCode = $('#louzuo_q').combobox("getValue");
	}
	params.danyuan = $('#danyuan_q').val();
	params.ceng = $('#louceng_q').val();
	params.ownerName = $('#ownerName_q').val();
	if ($('#shenfenXingzhi_q').combobox("getValue") != COMBOBOX_DEFAULT_SEL_VAL) {
		params.shenfenXingzhiCode = $('#shenfenXingzhi_q').combobox("getValue");
	}
	params.gongshangNo = $('#gongshangNo_q').val();
	if ($('#yongfangXingzhi_q').combobox("getValue") != COMBOBOX_DEFAULT_SEL_VAL) {
		params.yongfangXingzhiCode = $('#yongfangXingzhi_q').combobox("getValue");
	}
	if ($('#chargeState_q').combobox("getValue") != COMBOBOX_DEFAULT_SEL_VAL) {
		params.chargeState = $('#chargeState_q').combobox("getValue");
	}
	params.recordRemarks = $('#recordRemarks_q').val();
	if ($('#paymentDateId_q').combobox("getValue") != COMBOBOX_DEFAULT_SEL_VAL) {
		params.paymentDateId = $('#paymentDateId_q').combobox("getValue");
	}
	params.chargeDate = $('#chargeDate_q').datebox('getValue');
	params.operName = $('#operName_q').val();
	
//	params.ownerNo = $('#ownerNo_q').val();
	params.houseNo = $('#house_q').val();
	params.diverted = $('#diverted_q').prop("checked");
	params.stopped = $('#stopped_q').prop("checked");
	params.livingSohard = $('#livingSohard_q').prop("checked");
	params.wageNum = $('#wageNum_q').val();
	$("#toolbarChargeBtn").linkbutton("disable");
	$("#toolbarDetailBtn").linkbutton("disable");
	$("#toolbarCancelBtn").linkbutton("disable");
	$("#toolbarPrintBtn").linkbutton("disable");
	return true;
}

function exportHeatingReport() {
	var params = {};
	setQueryParams(params);
	if (!params.paymentDateId) {
		return;
	}
//	$.ajax({
//		url: ctx + '/report/heating',
//		type : "get",
//		data : params
//	});
	var form = $("<form>");   //定义一个form表单
    form.attr('style','display:none');   //在form表单中添加查询参数
    form.attr('target','');
    form.attr('method','get');
    form.attr('action', ctx + '/report/heatingall');
   
    var inputPaymentDate = $('<input>'); 
    inputPaymentDate.attr('type','hidden'); 
    inputPaymentDate.attr('name','paymentDateId'); 
    inputPaymentDate.attr('value',params.paymentDateId);
    form.append(inputPaymentDate);   //将查询参数控件提交到表单上
    
    var inputareaCode = $('<input>'); 
    inputareaCode.attr('type','hidden'); 
    inputareaCode.attr('name','areaCode'); 
    inputareaCode.attr('value',params.areaCode);
    form.append(inputareaCode);   //将查询参数控件提交到表单上
    
    var inputlouzuoCode = $('<input>'); 
    inputlouzuoCode.attr('type','hidden'); 
    inputlouzuoCode.attr('name','louzuoCode'); 
    inputlouzuoCode.attr('value',params.louzuoCode);
    form.append(inputlouzuoCode);   //将查询参数控件提交到表单上
    
    var inputdanyuan = $('<input>'); 
    inputdanyuan.attr('type','hidden'); 
    inputdanyuan.attr('name','danyuan'); 
    inputdanyuan.attr('value',params.danyuan);
    form.append(inputdanyuan);   //将查询参数控件提交到表单上
    
    var inputceng = $('<input>'); 
    inputceng.attr('type','hidden'); 
    inputceng.attr('name','ceng'); 
    inputceng.attr('value',params.ceng);
    form.append(inputceng);   //将查询参数控件提交到表单上
    
    var inputownerName = $('<input>'); 
    inputownerName.attr('type','hidden'); 
    inputownerName.attr('name','ownerName'); 
    inputownerName.attr('value',params.ownerName);
    form.append(inputownerName);   //将查询参数控件提交到表单上
    
    var inputshenfenXingzhiCode = $('<input>'); 
    inputshenfenXingzhiCode.attr('type','hidden'); 
    inputshenfenXingzhiCode.attr('name','shenfenXingzhiCode'); 
    inputshenfenXingzhiCode.attr('value',params.shenfenXingzhiCode);
    form.append(inputshenfenXingzhiCode);   //将查询参数控件提交到表单上
    
    var inputyongfangXingzhiCode = $('<input>'); 
    inputyongfangXingzhiCode.attr('type','hidden'); 
    inputyongfangXingzhiCode.attr('name','yongfangXingzhiCode'); 
    inputyongfangXingzhiCode.attr('value',params.yongfangXingzhiCode);
    form.append(inputyongfangXingzhiCode);
    
    var inputchargeState = $('<input>'); 
    inputchargeState.attr('type','hidden'); 
    inputchargeState.attr('name','chargeState'); 
    inputchargeState.attr('value',params.chargeState);
    form.append(inputchargeState);
    
    var inputrecordRemarks = $('<input>'); 
    inputrecordRemarks.attr('type','hidden'); 
    inputrecordRemarks.attr('name','recordRemarks'); 
    inputrecordRemarks.attr('value',params.recordRemarks);
    form.append(inputrecordRemarks);
    
    var inputchargeDate = $('<input>'); 
    inputchargeDate.attr('type','hidden'); 
    inputchargeDate.attr('name','chargeDate'); 
    inputchargeDate.attr('value',params.chargeDate);
    form.append(inputchargeDate);
    
    var inputoperName = $('<input>'); 
    inputoperName.attr('type','hidden'); 
    inputoperName.attr('name','operName'); 
    inputoperName.attr('value',params.operName);
    form.append(inputoperName);
    
    var inputhouseNo = $('<input>'); 
    inputhouseNo.attr('type','hidden'); 
    inputhouseNo.attr('name','houseNo'); 
    inputhouseNo.attr('value',params.houseNo);
    form.append(inputhouseNo);
    
    var inputdiverted = $('<input>'); 
    inputdiverted.attr('type','hidden'); 
    inputdiverted.attr('name','diverted'); 
    inputdiverted.attr('value',params.diverted);
    form.append(inputdiverted);
    
    var inputstopped = $('<input>'); 
    inputstopped.attr('type','hidden'); 
    inputstopped.attr('name','stopped'); 
    inputstopped.attr('value',params.stopped);
    form.append(inputstopped);
    
    var inputlivingSohard = $('<input>'); 
    inputlivingSohard.attr('type','hidden'); 
    inputlivingSohard.attr('name','livingSohard'); 
    inputlivingSohard.attr('value',params.livingSohard);
    form.append(inputlivingSohard);
    
    var inputwageNum = $('<input>'); 
    inputwageNum.attr('type','hidden'); 
    inputwageNum.attr('name','wageNum'); 
    inputwageNum.attr('value',params.wageNum);
    form.append(inputwageNum);
   
    $('body').append(form);  //将表单放置在web中
    
    form.submit();   //表单提交
}

function onLoadSuccess(data) {
	$('#yingshouHeatingCharge').text(data.yingshouHeatingCharge);
	$('#yishouHeatingCharge').text(data.yishouHeatingCharge);
}

</script>