define([
    'jquery', 
    'underscore',
    'backbone',
    'modules/media/model',
    'modules/media/collection',
    'modules/mucua/model',
    'modules/repository/model',
    'text!templates/common/header.html',
    'text!templates/common/menu.html',
    'text!templates/common/busca.html',
    'text!templates/common/footer.html',
    'text!templates/media/MediaResults.html',
    'text!templates/media/CaixaResultadoBusca.html'
], function($, _, Backbone, MediaModel, MediaCollection, MucuaModel, RepositoryModel, Header, Menu, Busca, Footer, MediaResults, CaixaResultadoBusca){
    var BuscaView = Backbone.View.extend({
	
	render: function(subroute){
	    mensagemBusca = "Buscando '" + subroute + "' no repositorio '" + repository + "' e na mucua '" + mucua + "'";
	    console.log(mensagemBusca);
	    
	    subroute = (subroute == null) ? '' : subroute;
	    url = '/api/' + repository + '/' +  mucua + '/bbx/search/' + subroute;
	    var mediaCollection = new MediaCollection([], {url: url});
	    
	    // compila cabecalho
	    if ($('#header').html() == '') {
		$('#header').append(_.template(Header, {'name': mucua}));
	    }
	    
	    // compila menu e busca
	    if (typeof $('#busca-menu').html() === 'undefined') {
		$('#content-full').prepend(_.template(Menu, repository, mucua));
		
		// TODO: busca está junto com menu nessa versao, talvez separar futuramente como um módulo configurável
		$('#busca-menu').append(_.template(Busca, {'repository': repository}, {'name': mucua}));
		
		//TODO: talvez seja legal buscar uma forma backbone de implementar os eventos
		do_search = function() {
		    url = $('#form_busca').attr('action') + $('#expressao_busca').val();
		    url = url.replace(" ", "%20");
		    url = url.replace("+", "/");
		    
		    document.location.href = url;
		}
		
		termos = [];
		$.each(subroute.split("/"), function(key, term) {
		    termos.push({repository: repository,
				 mucua: mucua,
				 termo: term,
				 complete_link: subroute
				});
		});
		
		console.log(termos);
		
		$('#menu').after(_.template(CaixaResultadoBusca, termos));
		$('#busca .button').click(function() { do_search() });
		$('#expressao_busca').keyup(function(e) { if (e.keyCode == 13) do_search(); });   // enter
	    }
	    
	    // breadcrumb
	    //$(".breadcrumb").html("");
	    
	    mediaCollection.fetch({
		success: function() {
		    var data = {
			medias: mediaCollection.models,
			config: {'imagePath': ''}, // TODO: centralizar as configuracoes em um arquivo mais central
	     		_: _ 
		    };
		    
		    var compiledTemplate = _.template(MediaResults, data);
		    $('#content').html(compiledTemplate);
		}
	    });
	    
	    // compila footer
	    if ($('#footer').html() == '') {
		$('#footer').append(Footer);
	    }
	}
    });
    
    return BuscaView;
});