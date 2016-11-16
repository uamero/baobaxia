define([
    'jquery', 
    'backbone',
    'backbone_subroute',
    'modules/mucua/model',
    'views/mucua/HomeMucua',
], function($, Backbone, BackboneSubroute, MucuaModel, HomeMucua){
    var Router = Backbone.SubRoute.extend({
	routes: {
	    '*' : 'homeMucua',
	    'info' : 'infoMucua',
	},

	initialize: function() {
	    console.log("module mucua loaded");
	},

	__getRepository: function() {
	    return this.prefix.split('/')[0];
	},
	__getMucua: function() {
	    return this.prefix.split('/')[1];
	},
	
	homeMucua: function() {	    
	    console.log("home mucua");

	    var repository = this.__getRepository(),
		mucua = this.__getMucua(),
		homeMucua = new HomeMucua(); 
	    
	    // TODO: verificar se mantem isso ou se cria view especifica para Network
	    if (mucua == 'rede') {
		BBXFunctions.renderCommon('rede');
	    } else {
		BBXFunctions.renderCommon('mucua');
	    }
	    
	    BBXFunctions.setNavigationVars(repository, mucua);
	    
	    homeMucua.render();
	},

	infoMucua: function() {
	    console.log("info mucua");
	}
    });
    
    return Router;
});
