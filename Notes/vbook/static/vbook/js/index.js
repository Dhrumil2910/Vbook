$('#main_menu_toggle').click(function() {
    $('.ui.sidebar')
        .sidebar('setting', 'transition', 'overlay')
        .sidebar('toggle');

});


var toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote', 'code-block','image','video'],

    [{ 'header': 1 }, { 'header': 2 }], // custom button values
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }], // superscript/subscript
    [{ 'indent': '-1' }, { 'indent': '+1' }], // outdent/indent
    [{ 'direction': 'rtl' }], // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }], // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }], // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean'] // remove formatting button
];

var optionsForEidtor = {
    theme: 'snow',
    placeholder: 'Write a note...',
    modules: {
        toolbar: toolbarOptions,
    }
};

<!-- Initialize Quill editor -->
var quill = new Quill('#editor', optionsForEidtor);

$('.add.note').click(function() {
	var moduleName = './quilljs-renderer/index';
	require([moduleName], function(renderer){
    	var Document  = renderer.Document;
		// Load the built-in HTML formatter 
		renderer.loadFormat('html');
		var contentOfTE = new Document(quill.getContents());
	    $('#note_test').html(contentOfTE.convertTo('html')) ;
	});
	
    alert("2");
        
});