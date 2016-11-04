$('#main_menu_toggle').click(function() {
    $('.main_sidebar')
        .sidebar('setting', 'transition', 'overlay')
        .sidebar('toggle');

});

var toolbarOptions = [
    ['bold', 'italic', 'underline', 'video', 'formula', { 'header': 1 }, { 'header': 2 }, { 'color': [] }, { 'background': [] }, 'link'], // toggled buttons

];

var optionsForEidtor = {
    theme: 'snow',
    placeholder: 'Write a note...',
    modules: {
        'toolbar': toolbarOptions,
        'formula': true,
    }
};

<!-- Initialize Quill editor -->
var editor = new Quill('#editor', optionsForEidtor);

$(".ql-toolbar").append("<a href='#' class='own-checkmark' data-tooltip='Done' data-position='bottom right' data-variation='mini'><i class='circular checkmark icon link own-class-checkmark' ></i></a>");

$('.ui.dropdown')
    .dropdown();

var editor_mod = new Quill('#editor-modal', optionsForEidtor);
jQuery(document).on('click', ".own-card-resize-full", function(data, response, xhr) {
    var $this = $(this);
    var id = $this.attr('id').split('-')[1];

    $.ajax({
        type: 'POST',
        url: '/vbook/get_contents_note',
        data: {
            note_id: id,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),

        },
        success: function(response) {
            if (response.success) {
                editor_mod.setContents(JSON.parse(response.delta));
            } else {;
            }
        }
    });

    $('.coupled.modal')
        .modal({
            allowMultiple: false
        });
    $('.own-edit-modal')
        .modal('attach events', '#expand-modal-' + id + ' #edit-modal-button-' + id)
        .modal({
            onApprove: function() {
                var delta = editor_mod.getContents();
                var remove_pbr_content = $('.ql-editor').html().replace('<p><br></p>', '<p></p>');
                $('.ql-editor').children('p').css('padding', 0);
                var edit_note_content = $('.ql-editor').html();
                $.ajax({
                    type: 'POST',
                    url: '/vbook/edit_note',
                    data: {
                        note_id: id,
                        contents: edit_note_content,
                        delta: delta,
                        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),

                    },
                    success: function(response) {
                        if (response.success) {
                            $('#note-' + id + '.own-description').html(edit_note_content);
                            alert('edited');
                        } else {;
                        }
                    }
                });
            }
        });
    // show first now
    $('#expand-modal-' + id)
        .modal('show');

});

/* Setting a fav Note*/
jQuery(document).on('click', ".own-fav-icon", function(data, response, xhr) {
    var $this = $(this);
    var id = $this.attr('id').split('-')[1];


    $.ajax({
        type: 'POST',
        url: '/vbook/set_fav_note',
        data: {
            id: id,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),

        },
        success: function(response) {
            if (response.fav) {
                $('#' + $this.attr('id')).attr("class", "star orange icon own-fav-icon")
            } else {
                $('#' + $this.attr('id')).attr("class", "star gray icon own-fav-icon")
            }
        }
    });
});

/* Saving a new Note */

jQuery(document).on('click', ".own-checkmark", function(data, response, xhr) {
    var $this = $(this);
    if ($('.ql-editor p:first-child').text() != "") {
        var note_title = $('.ql-editor p:first-child').text();
    } else if ($('.ql-editor h1:first-child').text() != "") {
        note_title = $('.ql-editor h1:first-child').text()
    } else {
        note_title = $('.ql-editor h2:first-child').text()
    }
    var delta = editor.getContents();
    var remove_pbr_content = $('.ql-editor').html().replace('<p><br></p>', '<p></p>');
    $('.ql-editor').children('p').css('padding', 0);
    var new_note_content = $('.ql-editor').html();
    var pathname = window.location.pathname;
    var url_id = pathname.split('/')[3];
    var time = player.getCurrentTime(); // returns elapsed time in seconds 
    var m = Math.floor(time / 60);
    var secd = time % 60;
    var s = Math.ceil(secd)
    var note_time = m + ":" + s;

    $.ajax({
        type: 'POST',
        url: '/vbook/add_note',
        data: {
            url_id: parseInt(url_id),
            note_title: note_title,
            delta: JSON.stringify(delta),
            content: new_note_content,
            time: note_time,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },
        success: function(response) {
            if (response.success) {
                console.log("added");
            } else {}
        }
    });
});

/* Deleting a note */
jQuery(document).on('click', ".own-delete-icon", function(data, response, xhr) {
    var $this = $(this);
    var id = $this.attr('id').split('-')[1];
    $.ajax({
        type: 'POST',
        url: '/vbook/delete_note',
        data: {
            note_id: id,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),

        },
        success: function(response) {
            if (response.success) {
                $('#note-' + id).fadeOut(500);
            } else {
                alert('Not able to delete the note')
            }
        }
    });
});


/* Expanding a note card */
$('.notebook-card-expand').click(function() {
    var id = $(this).attr('id');
    $('#' + id + '_modal').modal('show')
});

/* Setting a favorite Notebook */

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
                $('#' + $this.attr('id')).attr("class", "star orange icon own-fav-icon")
            } else {
                $('#' + $this.attr('id')).attr("class", "star gray icon own-fav-icon")
            }

        }

    });
});

/* Setting the color of a notebook */
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

/* Setting the color of a note */
jQuery(document).on('click', ".own-color-note", function(data, response, xhr) {
    var $this = $(this);
    var id = $this.attr('id').split('-')[1];
    var color = $this.attr('id').split('-')[2];

    $.ajax({
        type: 'POST',
        url: '/vbook/set_color_note/',
        data: {
            note_id: id,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            color: color
        },
        success: function(response) {
            $('#note-' + id).attr("class", "ui link " + response.color + " card own-card")
        }

    });
});
/*var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('video-player', {
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

onYouTubeIframeAPIReady();*/

/* Searching for a video to embed */

$(document).ready(function() {
    console.log("ready!");
    loadPlayer();
});



function loadPlayer() {
    if (typeof(YT) == 'undefined' || typeof(YT.Player) == 'undefined') {

        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        window.onYouTubePlayerAPIReady = function() {
            onYouTubePlayer();
        };

    } else {

        onYouTubePlayer();

    }
}

var player;

function onYouTubePlayer() {
    player = new YT.Player('video-player', {

        playerVars: { controls: 1, showinfo: 0, rel: 0, showsearch: 0, iv_load_policy: 3 },
        events: {
            'onStateChange': onPlayerStateChange,
            'onError': catchError
        }
    });
}

var done = false;

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
        // setTimeout(stopVideo, 6000);
        done = true;
    } else if (event.data == YT.PlayerState.ENDED) {
        location.reload();
    }
}

function onPlayerReady(event) {

    //if(typeof(SONG.getArtistId()) == undefined)
    //{
    //  console.log("undefineeeed"); 
    //} 
    //event.target.playVideo();   
}

function catchError(event) {
    if (event.data == 100) console.log("De video bestaat niet meer");
}

function stopVideo() {
    player.stopVideo();
}

jQuery(document).on('click', ".own-search-icon", function(data, response, xhr) {


});

/*setInterval("checkFocus()", 1);

function checkFocus() {
    if (editor.hasFocus()) {
        player.pauseVideo();
    }
}
*/
$(document).ready(function() {
    $("div.bhoechie-tab-menu>div.list-group>a").click(function(e) {
        e.preventDefault();
        $(this).siblings('a.active').removeClass("active");
        $(this).addClass("active");
        var index = $(this).index();
        $("div.bhoechie-tab>div.bhoechie-tab-content").removeClass("active");
        $("div.bhoechie-tab>div.bhoechie-tab-content").eq(index).addClass("active");

    });

});

/*$(".own-video-card").slice(0, 4).show();
$("#loadMore").on('click', function(e) {
    e.preventDefault();
    $(".own-video-card:hidden").slice(0, 4).slideDown();
    if ($(".own-video-card:hidden").length == 0) {
        $("#load").fadeOut('slow');
    }
    $('html,body').animate({
        scrollTop: $(this).offset().top
    }, 1500);
});*/


jQuery(document).on('click', ".own-chapter-link", function(data, response, xhr) {
    $('.own-st-cards').css('display', 'none');
    $('.own-st-cards').fadeIn('slow');
});

jQuery(document).on('click', "#own-chapter-label", function(data, response, xhr) {
    var text = $('#own-add-chapter-text').val()
    var pathname = window.location.pathname;
    var notebook_id = pathname.split('/')[2];

    $.ajax({
        type: 'POST',
        url: '/vbook/add_chapter/',
        data: {
            notebook_id: notebook_id,
            chapter: text,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },
        success: function(response) {
            if (response.success) {
                /*$('#own-st-cards').load('#own-st-cards');*/
            }
        }

    });
});


jQuery(document).on('click', "#own-video-label", function(data, response, xhr) {
    var text = $('#own-add-video-text').val();
    var chapter_id = $("ul#own-tabs li.active").attr("id").split('-')[1];
    var chapter_title = $("ul#own-tabs li.active").attr("id").split('-')[2];
    $('#own-video-add').fadeToggle('1000');
    $('#own-add-video-text').val('');
    window.location.hash = '#' + chapter_title;

    $.ajax({
        type: 'POST',
        url: '/vbook/add_url/',
        data: {
            chapter_id: chapter_id,
            url: text,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },
        success: function(response) {
            if (response.success) {
                $('#own-st-cards').load(document.URL + ' #own-st-cards');
                alert('added');
            }
        }

    });
});

jQuery(document).on('click', "#fixedButton", function(data, response, xhr) {
    $('#own-video-add').fadeToggle('1000');
});

function currentInput() {
    a = $('.ui.search').search('get value');
    return a
};
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

jQuery(document).on('click', ".own-play-time", function(data, response, xhr) {
    var $this = $(this);
    var id = $this.attr('id').split('-')[1];
    var time = $('#play-' + id).text();
    var min = time.split(':')[0];
    var sec = time.split(':')[1];
    var millisec = parseInt(min * 60) + parseInt(sec);
    player.seekTo(millisec);

});
