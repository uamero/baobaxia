define([
    'jquery', 
    'lodash',
    'jquery_form',
    'backbone',
    'fileupload',
    'textext',
    'textext_ajax',
    'textext_autocomplete',
    'modules/bbx/functions',
    'modules/media/functions',
    'modules/media/model',
    'modules/mucua/model',
    'modules/mucua/collection',
    'text!/templates/' + BBX.userLang + '/media/MediaGalleryCreate.html',
    'text!/templates/' + BBX.userLang + '/media/MediaGalleryEdit.html',
    'text!/templates/' + BBX.userLang + '/media/MediaGalleryEditItem.html',
    'text!/templates/' + BBX.userLang + '/media/MediaGalleryCreateErrorMessage.html',
    'text!/templates/' + BBX.userLang + '/media/MediaGalleryCreateValidationErrorMessage.html',
    'text!/templates/' + BBX.userLang + '/media/MediaGalleryCreateMessage.html'
], function($, _, JQueryForm, Backbone, FileUpload, Textext, TextextAjax, TextextAutocomplete, BBXFunctions, MediaFunctions, MediaModel, MucuaModel, MucuaCollection, MediaGalleryCreateTpl, MediaGalleryEditTpl, MediaGalleryEditItemTpl, MediaGalleryCreateErrorMessageTpl, MediaGalleryCreateValidationErrorMessageTpl, MediaGalleryCreateMessageTpl){
    
    var MediaGalleryCreate = Backbone.View.extend({	
	render: function(){
	    var data = {},
		config = BBX.config,
		url = config.apiUrl + "/" + config.MYREPOSITORY + "/" + config.MYMUCUA + "/media/",
		mucuas = new MucuaCollection([], {url: config.apiUrl + '/' + config.MYREPOSITORY + '/mucuas'});

	    BBXFunctions.renderSidebar();
	    BBXFunctions.renderUsage();
	    MediaFunctions.__parseMenuSearch();
	    
	    // get mucuas list
	    mucuas.fetch({
		success: function() {
		    var mucuasLength = mucuas.models.length;
		    BBX.mucuaList = [];
		    
		    for (var m = 0; m < mucuasLength; m++) {
			var mucua = mucuas.models[m].attributes;
			BBX.mucuaList.push(mucua);
			$('#origin').append("<option value='" + mucua.description + "'>" + mucua.description + "</option>");
		    }
		    $('select[name="origin"]').find('option:contains("' + BBX.config.MYMUCUA + '")').prop("selected",true);

		    
		}
	    });

	    var validateUpload = function() {
		// checa se titulo e tags foram preenchidos
		var validationError = [];
		// especifico - textext / tags
		if ($('#fileupload').find('input[name="tags"]').val() === "[]") {
		    validationError.push('#tags');
		}
		_.each(validationError, function(el) {
		    $(el).css('border', '2px solid red');
		});
		if (validationError.length > 0) {
		    $('#messages').html(_.template(MediaGalleryCreateValidationErrorMessageTpl));
		    return false;
		} else {
		    return true;
		}
	    };
	
	    var prepareUpload = function() {
		console.log('prepare upload');
		
		$('#media_file_input').show();

		$('#fileupload').fileupload({
		    dataType: 'json',
		    url: url,
		    beforeSend: function(xhr) {
			xhr.setRequestHeader('Authorization', 'JWT ' +  sessionStorage.token);
		    },
		    change: function(e, data) {
			var terms = $('#fileupload').find('input[name="tags"]').val();
			terms = terms.substring(1, terms.length -1).replace(/\"/g,'');
			$('#fileupload').find('input[name="tags"]').val(terms);
			$('#messages').append('<img src="../images/loading.gif" /><br/>');
		    },
		    
		    done: function(e, dataResult) {
			var data = {
			    media: {
				uuid: dataResult.result.uuid
			    }
			};
			$('#messages').append(_.template(MediaGalleryCreateMessageTpl, data));
			var overallProgress = $('#fileupload').fileupload('progress');
			if (overallProgress.loaded === overallProgress.total) {
			    var terms = $('#fileupload').find('input[name="tags"]').val(),
				gallery_url = '';

			    terms = terms.substring(0, terms.length).replace(/\"/g,'');
			    terms = terms.replace(',', '/');
			    console.log(terms);
			    gallery_url = config.interfaceUrl + config.MYREPOSITORY + '/' + dataResult.result.origin + '/media/gallery/' + terms + '/edit';
			    
			    window.location.replace(gallery_url);
			}
		    },

		    progressall: function (e, data) {
			var progress = parseInt(data.loaded / data.total * 100, 10);
			$('#progress .bar').css(
			    'width',
			    progress + '%'
			);
		    },
		    
		    error: function(jqXHR, textStatus, errorThrown) {
			var data = {
			    errorMessage: textStatus,
			    errorThrown: errorThrown
			};
			$('#messages').remove('img')[0];
			$('#messages').append(_.template(MediaGalleryCreateErrorMessageTpl, data));
			console.log('error at upload');
		    }
		});
	    }
	    
	    // session user data
	    config.userData = localStorage.userData;
	    
	    // set data
	    data.types = MediaFunctions.getMediaTypes(),
	    data.licenses = MediaFunctions.getMediaLicenses();
	    data.config = config;
	    data.page = 'Create Gallery';
	    data.pageTitle = "Create new Gallery";	    
	    
	    // instantiate model with default values
	    data.media = new MediaModel([]);	    
	    data.media.origin = config.MYMUCUA;
	    data.media.repository = config.MYREPOSITORY;
	    data.media.author = config.userData.username;
	    
	    $('head').append('<link rel="stylesheet" href="/css/textext.plugin.autocomplete.css" type="text/css" />');
	    $('#content').html(_.template(MediaGalleryCreateTpl, data));
	    
	    // tags
	    var urlApiTags = Backbone.history.location.origin + config.apiUrl + '/' + config.MYREPOSITORY + '/' + config.MYMUCUA + '/tags/search/';
	    
	    $('#tags')
	        .textext({
		    plugins : 'autocomplete tags ajax',
		    ajax : {
			url : urlApiTags,
			dataType : 'json'
		    }
		})
	    // on select type of file, prepare upload
	    prepareUpload();
	    
	    $('#media_file').on('click', function(e) {
		var validate = validateUpload();
		if (!validate) {
		    e.preventDefault();
		} else {
		    // com validacao ok, limpa mensagens
		    $('#messages').html();
		}
	    });
	}
    });
    
    return MediaGalleryCreate;
});
    
