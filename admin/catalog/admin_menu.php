

<style>

.background_admin_panel
{
	display: none;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	position: fixed;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 100;	
}


.window_admin_panel 
{
	position: relative;
	margin: auto;
	width: 900px;
	height: 700px;	
	
	background: white;
	border-radius: 8px;
	box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.5);
	display: -webkit-box;
	display: flex;
	-webkit-box-orient: vertical;
	-webkit-box-direction: normal;
	flex-direction: column;
}


.button_close_admin_panel
{
	position: absolute;
	width: 40px;	
	height: 40px;
	top: 15px;
	right: 20px;
		
	font-size: 70px;

	-webkit-transform: rotate(-45deg);
	-moz-transform: rotate(-45deg);
	-o-transform: rotate(-45deg);
	-ms-transform: rotate(-45deg);
	transform: rotate(-45deg);
	
	font-family: arial,sans-serif;
	text-align: center;
	text-decoration: none;
	line-height: 0.6em;
	color: #666;
	cursor: pointer;	
}

</style>



<div class="background_admin_panel" nameId="background_admin_panel" ui_2="">
	<div class="modal_wrap">
		<div class="window_admin_panel" nameId="window_admin_panel" style="width: 1300px; height: 80%;">
			<div class="button_close_admin_panel" nameId="button_close_admin_panel">
				+
			</div>
			<div class="modal_header">
				<div class="modal_title">
					<div class="modal_name">
						Меню
					</div>
				</div>					
			</div>
			<div class='modal_body'>
				<div class='modal_body_content'>
					<div class="flex_1">						
						<div class="button1 button_gradient_1" nameId="button_add_group_admin_panel" style="margin: 15px 0 15px 40px; padding: 4px 11px;">Раздел</div>  
						
						<div class="flex_1 align_items" style="width: auto;">
							<input type="text" class="input_add_group_admin_panel" style="width: 200px; margin:5px 0 5px 45px;" nameId="input_add_group_admin_panel" value="">
						</div>

						<div class="flex_1 align_items" style="width: auto; margin: auto 0 auto auto;">
							<input type="text" class="input_add_group_admin_panel" style="width: 200px; margin:5px 0 5px 25px;" nameId="input_rename_group_admin_panel" value="">
						</div>

						<div class="button1 button_gradient_1" nameId="button_rename_group_admin_panel" style="margin: 15px 40px 15px 40px; padding: 4px 11px;">Переименовать</div> 
					</div>
					
					<div class='flex_1'>
						<div class='right_panel_1_1_list relative_1 block_select_text' list_ui="admin_catalog" style="width: 70%; min-height: 800px;">

						</div>
						
						<div class='right_panel_1_1_list relative_1 block_select_text' list_ui="admin_obj_bd" style="width: 30%; min-height: 800px;">

						</div>
					</div>
					
					<div class='flex_1'>
						<div class="button1 button_gradient_1" nameId="save_admin_panel" style="margin-top: 30px;">Сохранить</div>
						<div class="button1 button_gradient_1" nameId="reset_admin_panel" style="margin-top: 30px;">Reset</div>
					</div>						
				</div>				
			</div>
			<div class='modal_footer'>
			</div>
		</div>			
	</div>	
</div>



