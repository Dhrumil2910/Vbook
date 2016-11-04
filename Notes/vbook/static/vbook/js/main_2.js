 $('#main_menu_toggle').click(function() {
    $('.main_sidebar')
        .sidebar('setting', 'transition', 'overlay')
        .sidebar('toggle');


});


 $('.ui.dropdown')
     .dropdown();



 jQuery(document).on('click', '.notebook-card-expand', function() {
     console.log("here");
     var id = $(this).attr('id');
     console.log(id);
     $('#' + id + '-modal').modal('show')
 });

 $('#notebook-add').click(function() {
     $('#notebook-add-modal').modal('show')
 });

 $('#notebook-add-cancel').click(function() {
     $('#notebook-add-modal').modal('hide')
 });


 jQuery(document).on('click', ".own-fav-icon", function(data, response, xhr) {
     var $this = $(this);
     var id = $this.attr('id').split('-')[1];

     $.ajax({
         type: 'POST',
         url: '/vbook/set_fav_notebook/',
         data: {
             id: id,
             csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),

         },
         success: function(response) {
             if (response.fav) {
                 $('#' + $this.attr('id')).attr("class", "star orange icon own-fav-icon");
             } else {
                 $('#' + $this.attr('id')).attr("class", "star gray icon own-fav-icon");
             }
         }

     });
 });

 jQuery(document).on('click', ".own-share-icon", function(data, response, xhr) {
     var $this = $(this);
     var id = $this.attr('id').split('-')[1];

     $.ajax({
         type: 'POST',
         url: '/vbook/set_share_notebook/',
         data: {
             id: id,
             csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),

         },
         success: function(response) {
             if (response.shared) {
                 $('#' + $this.attr('id')).html('<i class="share alternate white icon"></i>Un-Share');
             } else {
                 $('#' + $this.attr('id')).html('<i class="share alternate white icon"></i>Share');
             }
         }
     });
 });

 jQuery(document).on('click', "#notebook-add-submit", function(data, response, xhr) {
     var $this = $(this);
     // Get New Notebook Name
     var title = $('#notebook-add-title').val().trim();
     var description = '';
     if (title.length === 0) {
         return;
     }
     // Clear input field
     $.ajax({
         type: 'POST',
         url: '/vbook/add_notebook/',
         data: {
             title: title,
             description: description,
             csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),

         },
         success: function(response) {
             if (response.status === 'success') {
                 //Add new notebook here
                 $('#notebook-add-error').hide();
                 $('#notebook-add-modal').modal('hide');
                 $('#notebook-add-title').val('');
                 $('#notebook-add-description').val('');
                 var last_edited = response.last_edited;
                 var id = response.id
                 var new_notebook = '<div class="ui link blue card own-card notebook-card" id="notebook-' + id + '"><div class="image"><img src="/static/vbook/images/alphabets/' + title[0].toLowerCase() + '.png"></div><div class="content"><span class="right floated play link"><i class="star icon own-fav-icon" id="fav-' + id + '"></i></span><div class="ui small modal" id="notebook-' + id + '-modal"><div class="header">' + title + '</div><div class="content">' + description + '</div></div><div class="header twelve wide own-header" style="font-weight:bold;font-family: "Montserrat", sans-serif;"><a href="/vbook/' + id + '/">' + title + '</a></div></div><div class="extra content"><div class="ui left floated"><div class="item" style="font-size:0.8em"><i class="history grey icon"></i>' + last_edited + '</div></div><div class="ui left pointing right floated dropdown two wide"><i class="ellipsis vertical icon"></i><div class="left menu"><div class="item"><i class="share alternate white icon"></i>Share</div><div class="item"><i class="edit white icon"></i>Edit</div><div class="item"><i class="paint brush icon"></i>Color</div><a class="item"><text data-tooltip="Red"><i class="red stop icon own-color" id="color-' + id + '-red"></i></text><text data-tooltip="Yellow"><i class="yellow stop icon own-color" id="color-' + id + '-yellow"></i></text><text data-tooltip="Green"><i class="green stop icon own-color" id="color-' + id + '-green"></i></text><text data-tooltip="Blue"><i class="blue stop icon own-color" id="color-' + id + '-blue"></i></text></a><div class="item delete-notebook" id="delete-' + id + '"><i class="red trash icon"></i>Delete</div></div></div><span class="ui right floated notebook-card-expand" id="notebook-' + id + '"><i class="expand icon"></i></span></div></div>';
                 $(".notebook-cards").prepend(new_notebook);
                 // Activate semantic again
                 $('.ui.dropdown').dropdown();
                 $('#' + id + '-modal').modal('set active');

             } else {
                 $('#notebook-add-error').show();
             }

         }

     });
 });

 jQuery(document).on('click', ".delete-notebook", function(data, response, xhr) {
     var $this = $(this);
     // Get New Notebook Name
     var id = $this.attr('id').split('-')[1];
     console.log("here", id);

     // Clear input field
     $.ajax({
         type: 'POST',
         url: '/vbook/delete_notebook/',
         data: {
             id: id,
             csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),

         },
         success: function(response) {
             if (response.status === 'success') {
                 //Add new notebook here
                 $('#notebook-' + id)
                     .transition('horizontal flip', 500, function() {
                         $('#notebook-' + id).hide();
                     });
             }
         }

     });
 });

 jQuery(document).on('click', ".own-color", function(data, response, xhr) {
     var $this = $(this);
     var id = $this.attr('id').split('-')[1];
     var color = $this.attr('id').split('-')[2];

     $.ajax({
         type: 'POST',
         url: '/vbook/set_color_notebook/',
         data: {
             id: id,
             csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
             color: color
         },
         success: function(response) {
             $('#notebook-' + id).attr("class", "ui link " + response.color + " card own-card notebook-card")
         }

     });
 });


 function currentInput() {
     a = $('.ui.search').search('get value');
     return a
 };

 // jQuery(document).ready(function($) {
 // $('#tokenize').tokenize({
 //     placeholder: 'Search',
 //     maxElements: 6 
 // });

 // $('#tokenize').keypress(function(e) {
 //     if(e.which != 13)
 //         return;
 //     console.log($('#tokenize').dropdown('get value'));
 //     query = JSON.stringify($('#tokenize').dropdown('get value'));
 //     $.ajax({
 //         type: 'POST',
 //         url: '/vbook/search_all/',
 //         data: {
 //             csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
 //             query: query
 //         },
 //         success: function(response) {                
 //             console.log('here', response.notebook);
 //         }
 //     });
 // });

 // $('.ui.dropdown')
 // .dropdown({
 //     allowAdditions: true
 // })

 a = $('.ui.search')
     .search({
         type: 'category',
         minCharacters: 3,
         apiSettings: {
             onResponse: function(githubResponse) {
                 console.log(githubResponse);
                 var
                     response = {
                         results: {}
                     };
                 // translate GitHub API response to work with search
                 $.each(githubResponse.items, function(index, item) {
                     var
                         type = item.type || 'Unknown',
                         maxResults = 8;
                     if (index >= maxResults) {
                         return false;
                     }
                     // create new language category
                     if (response.results[type] === undefined) {
                         response.results[type] = {
                             name: type,
                             results: []
                         };
                     }
                     // add result to category
                     response.results[type].results.push({
                         title: item.name,
                         description: item.description,
                         url: item.url
                     });
                 });
                 return response;
             },
             url: '/vbook/search_all?q={query}',
             method: 'POST',
             data: {
                 csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
             }
         }
     });
 // });
