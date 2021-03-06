<%@page pageEncoding="UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>
<head>
	<meta charset="UTF-8">
	<title>供暖改造费报表</title>
	<meta name="menu" content="HeatingMaintain"/>
</head>
<body>
    <div class="easyui-layout" style="height: 500px;">
    <div data-options="region:'west',split:true,title:'区域导航'" style="width:170px;">
       <ul id="baseTree" class="easyui-tree" 
           data-options="url:'${ctx}/admin/BaseManagement/baseTreeElementsOfHeatingMaintain',
			method:'get',
			formatter:formatTreeNode,
			onLoadSuccess : selectFirstNode,
			onClick: treeNodeOnClick
			"></ul>
    </div>
    <div id="mainPanle" region="center">
    <div class="easyui-panel" title="查询条件" collapsible="true" style="height:70px;">
	  <div class="easyui-layout" fit="true">
  		<div region="east" border="false"  split="true"  style="width:200px;">
			<div style="padding-left: 10px;padding-top: 10px;">
				<a href="#" class="easyui-linkbutton"  iconCls="icon-search" onclick="searchTongjiInfo()"
					style="margin-bottom: 5px;">查询</a>
				<a href="#" class="easyui-linkbutton" iconCls="icon-reload"
					onclick="clearHouseQuery()">重置</a>
			</div>
		</div>
		<div region="center" border="false" style="border:1px solid #ccc;padding-top: 5px;">
		   <table>
	    		<tr>
	    		    <td><span style="margin-left: 10px;">操作员:</span></td>
	    			<td>
	    			   <input id="hpsUser_q" name="user.username" class="easyui-combobox" 
	    			   		style="width:100px;" panelHeight="200px">
                       </input>
	    			</td>
	    			<td><div style="margin-left: 10px;text-align:right">缴费时间:</div></td>
	    			<td>
	    			   <input id="startTime_q" style="width: 155px;" class="easyui-datetimebox" type="text" name="payStartDate"></input>
	    			   ~
	    			   <input id="endTime_q"  style="width: 155px;" class="easyui-datetimebox" type="text" name="payEndDate"></input>
    				</td>
    			</tr>
    	   </table>
		</div>
	   </div>
	</div>
	<div  class="easyui-layout" style="padding-top:5px">
	<table id="data_grid" class="easyui-datagrid"  title="供暖改造缴费统计结果" 
			data-options="url:'${ctx}/heatingmaintain2015/usertongjiresult',
			singleSelect:true,
			collapsible:true,
			method:'get',
			showFooter: true,
			onCheck : userTongjiRowOnCheck,
			onBeforeLoad:setQueryParams,
			onLoadSuccess:function() { if($('#data_grid').datagrid('getData').rows.length > 0) {
			                             $('#toolbarExport').linkbutton('enable');
			                           } 
			                         },
			toolbar: [{
				       id : 'toolbarExport',
					   iconCls: 'icon-print',
					   text:'导出缴费记录',
					   handler:function() { exportElectricReport(); }
			       }]"
			rownumbers="true">
		<thead>
			<tr>
				<th data-options="field:'operName',width:110,align:'center'">操作员</th>
				<th data-options="field:'mustCharge',width:120,align:'center'">应收合计</th>
				<th data-options="field:'actualCharge',width:120,align:'center'">实收合计</th>
				<th data-options="field:'houseCount',width:100,align:'center'">户数</th>
			</tr>
		</thead>
	</table>
	</div>
	<c:set var="scripts" scope="request">
	   <%@ include file="/scripts/HeatingMaintainChargeTongji.js"%>
	</c:set>
	</div>
	</div>
</body>
