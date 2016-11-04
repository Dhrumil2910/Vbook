from django.shortcuts import render, get_object_or_404
from django.views import generic
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from .models import User, Notebook, Tag, URL, Note
from django.http import Http404
from django.shortcuts import render, redirect, render_to_response
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.template import loader, RequestContext
from .models import Notebook, URL, Note, Tag, User
from django.views import generic
from django.views.generic.edit import View
from .models import Notebook, Note
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Q
from django.contrib.auth import authenticate, login
from .forms import UserForm
from django.views.decorators.csrf import csrf_exempt

# # Create your views here.

class NotebookView(LoginRequiredMixin, generic.ListView):
    template_name = 'vbook/notebook.html'
    context_object_name = "notebook_list"
    login_url = 'login/'
    redirect_field_name = 'redirect_to'


    def get_queryset(self):
        return Notebook.objects.filter(user=self.request.user).order_by('-last_edited')

class DiscoverView(LoginRequiredMixin, generic.ListView):
    template_name = 'vbook/notebook.html'
    context_object_name = "notebook_list"
    # login_url = 'login/'
    # redirect_field_name = 'redirect_to'

    def get_queryset(self):
        return Notebook.objects.filter(public=True).order_by('-last_edited')


# Register User
class UserFormView(View):
    form_class = UserForm
    template_name = 'vbook/registeration_form.html'

    # diplay blank form
    def get(self, request):
        form = self.form_class(None)
        return render(request, self.template_name, {'form': form})

    # process form data
    def post(self, request):
        form = self.form_class(request.POST)
        form.save()

        if form.is_valid():
            user = form.save(commit=False)
            # cleaned (normalized) data
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user.set_password(password)
            user.save()

            # return User objects if credentials are correct
            user = authenticate(username=username, password=password)

            if user is not None:
                if user.is_active:
                    login(request, user)
                    return redirect('vbook:notebook')

        return render(request, self.template_name, {'form': form})


# set notebook favourites
def set_fav_notebook(request):
    if request.method == 'POST':
        notebook_id = request.POST['id']
        notebook = Notebook.objects.get(pk=notebook_id)
        if notebook.is_favorite is True:
            notebook.is_favorite = False
        else:
            notebook.is_favorite = True
        notebook.save()
        notebook = Notebook.objects.get(pk=notebook_id)
        fav_status = {'fav': notebook.is_favorite}
        # success_url = {'s_url': '/vbook/url/' + str(note.url.id)}
        return JsonResponse(fav_status)


def set_color_notebook(request):
    if request.method == 'POST':
        notebook_id = request.POST['id']
        notebook = Notebook.objects.get(pk=notebook_id)
        notebook.color = request.POST['color']
        notebook.save()
        notebook = Notebook.objects.get(pk=notebook_id)
        color = {'color': notebook.color}
        # success_url = {'s_url': '/vbook/url/' + str(note.url.id)}
        return JsonResponse(color)


# set notebook favourites
def set_share_notebook(request):
    if request.method == 'POST':
        notebook_id = request.POST['id']
        notebook = Notebook.objects.get(pk=notebook_id)
        if notebook.public is True:
            notebook.public = False
        else:
            notebook.public = True
        notebook.save()
        print notebook.public
        notebook = Notebook.objects.get(pk=notebook_id)
        share_status = {'shared': notebook.public}
        # success_url = {'s_url': '/vbook/url/' + str(note.url.id)}
        return JsonResponse(share_status)


def add_notebook(request):
    if request.method == 'POST':
        nb_title = request.POST['title']
        nb_desc = request.POST['description']
        # print notebook_title, notebook_description, request.user
        notebook = Notebook.objects.create(
            user=request.user, title=nb_title, description=nb_desc)
        try:
            notebook.save()
            return JsonResponse({'status': 'success', 'id': notebook.pk,
                                 'last_edited': notebook.last_edited})
        except:
            return JsonResponse({'status': 'error'})


def delete_notebook(request):
    if request.method == 'POST':
        nb_id = request.POST['id']
        notebook = Notebook.objects.get(
            user=request.user, id=nb_id)
        try:
            notebook.delete()
            return JsonResponse({'status': 'success'})
        except:
            return JsonResponse({'status': 'error'})


def search_all(request):
    response = {}
    results = []
    query = request.GET.get('q', '')
    if query != '':
        print request.user
        q_title = Q(title__icontains=query)
        q_content = Q(content__icontains=query)
        q_desc = Q(description__icontains=query)
        all_notebooks = Notebook.objects.filter(user=request.user)
        q_notebooks = Q(notebook__in=all_notebooks)
        match_notebook = Notebook.objects.filter(
            q_title | q_desc, user=request.user).distinct()
        match_note = Note.objects.filter(
            q_title | q_content, q_notebooks).distinct()
        for i in match_notebook:
            if len(i.description) > 80:
                i.description = i.description[:80] + '...'
            results.append({'name': i.title, 'url': 'google.com',
                            'description': i.description, 'type': 'Notebooks'})
        for i in match_note:
            if len(i.content) > 80:
                i.content = i.content[:80] + '...'
            results.append({'name': i.title, 'url': 'google.com',
                            'description': i.content, 'type': 'Notes'})
        response['items'] = results
    return JsonResponse(response)


def notebook_detail(request, notebook_id):
    try:
        nb = Notebook.objects.get(pk=notebook_id)
        tags = Tag.objects.filter(notebook=nb)
        jsonObTV = {}
        for tagName in tags:
            urls = URL.objects.filter(tag=tagName)
            if urls.count() != 0 :
                for urlName in urls:
                    notes = Note.objects.filter(url=urlName)
                    if tagName in jsonObTV:
    					jsonObTV[tagName].append({'urlname': urlName, 'No_of_notes':notes.count()})
                    else:
                        jsonObTV[tagName] = [{'urlname': urlName, 'No_of_notes':notes.count()}]
            else:
                jsonObTV[tagName] = [{'urlName': 'No video', 'No_of_notes': 'No video'}]
        url_path = "/vbook/url"
    except URL.DoesNotExist:
        raise Http404('Notebook does not exist')
    return render(request, 'vbook/details_nb.html', {'jsonObTV' : jsonObTV, 'url_path': url_path})


def url_detail(request, url_id):
	try:
		notes = Note.objects.filter(url=url_id)
		print notes
	except Note.DoesNotExist:
		raise Http404('video does not exist')
	return render(request, 'vbook/details_url.html', {'notes': notes})

def set_fav_note(request):
	if request.method == 'POST':
		note_id = request.POST['id']
		note = Note.objects.get(pk=note_id)
		if note.is_favorite == True:
			note.is_favorite = False
		else:
			note.is_favorite = True
		note.save()
		note = Note.objects.get(pk=note_id)
		fav_status = {'fav': note.is_favorite}
		# success_url = {'s_url': '/vbook/url/' + str(note.url.id)}
		return JsonResponse(fav_status)

def add_note(request):
	if request.method == 'POST':
		url = URL.objects.get(pk=request.POST['url_id'])
		title = request.POST['note_title']
		delta = request.POST['delta']
		content = request.POST['content']
		time = str(request.POST['time'])
		note = Note(url=url, title=title, content=content, delta_object=delta, time=time)
		note.save()
		return JsonResponse({'success': True})

def delete_note(request):
	if request.method == 'POST':
		note = Note.objects.get(pk=request.POST['note_id'])
		note.delete()
		return JsonResponse({'success': True})

def set_color_note(request):
	if request.method == 'POST':
		note = Note.objects.get(pk=request.POST['note_id'])
		note.color = request.POST['color']
		note.save()
		color = {'color': request.POST['color']}
		return JsonResponse(color)

def get_contents_note(request):
	if request.method == 'POST':
		note = Note.objects.get(pk=request.POST['note_id'])
		return JsonResponse({'delta' : note.delta_object, 'success': True})

def edit_note(request):
	if request.method == 'POST':
		note = Note.objects.get(pk=request.POST['note_id'])
		note.content = request.POST['contents']
		delta_object = request.POST['delta']
		success = {'success': True}
		return JsonResponse(success)

def add_url(request):
	if request.method == 'POST':
		tag_id = request.POST['chapter_id']
		tag = Tag.objects.get(pk=tag_id)
		url = URL()
		url.title = "New Video"
		url.url = request.POST['url']
        url.tag = tag
        url.save()
        return JsonResponse({'success': True})

def add_chapter(request):
    if request.method == 'POST':
        notebook_id = request.POST['notebook_id']
        notebook = Notebook.objects.get(pk=notebook_id)
        tag = Tag()
        tag.notebook = notebook
        tag.title = request.POST['chapter']
        tag.save()
        return JsonResponse({'success': True})

@csrf_exempt
def url_detail_json(request, url_id):
    try:
        notes = Note.objects.filter(url=url_id)
        print notes
        response = {'url': notes[0].url.url}
        results = []
        for i in notes:
            results.append({'title': i.title, 'content': i.content,
                            'delta_object': i.delta_object, 'is_favorite': i.is_favorite, 'time': i.time})
        response['notes'] = results
        return JsonResponse(response)
    except:
        # raise Http404('video does not exist')
        return JsonResponse({'error': 'Video Does not Exist'})
		