document.addEventListener('DOMContentLoaded', () => {
  const tags = [];

  setInterval(() => {
    document.querySelector('.datetime').innerText = new Date();
  }, 1000);

  const deleteTag = (e) => {
    const tagContainer = e.target.closest('.tag');
    const tag = tagContainer.querySelector('span').innerText;

    const index = tags.indexOf(tag);
    tags.splice(index, 1);

    renderTags();
  }

  const renderTags = () => {
    document.querySelector('.tags-display').innerHTML = '';
    tags.forEach((tag) => {
      const div = document.createElement('div');
      div.className = 'tag';
      div.innerHTML = `<span>${tag}<span><i class='bi bi-x remove-tag' onClick='deleteTag(event)'></div>`;
      document.querySelector('.tags-display').appendChild(div);
    })
  }

  document.querySelector('.tags-input').addEventListener('input', (e) => {
    if (e.target.value.endsWith(',')) {
      if (!tags.includes(e.target.value.slice(0, -1).toLowerCase())) {
        tags.push(e.target.value.slice(0, -1).toLowerCase());
        renderTags();
      }
      e.target.value = '';
    }
  });

  let editor;
  
  ClassicEditor
  .create( document.querySelector( '#editor' ) )
  .then( newEditor => {
    editor = newEditor;
  })
  .catch( error => {
    console.error( error );
  } );

  const generateId = () => {
    const alphabet = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'];
    const id = []
    for (let i = 0; i < Math.floor(Math.random() * 4) + 16; i++) {
      id.push(alphabet[Math.floor(Math.random() * 16)]);
    }
    return id.join('');
  }

  const id = generateId();

  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + '=') {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  document.querySelector('.save').addEventListener('click', async () => {
    if (editor.getData().length === 0) {
      alert('Ensure journal is not empty before saving.');
      return;
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
      },
      body: JSON.stringify({
        id: id,
        body: editor.getData(),
        tags: tags.join(),
      }),
    };

    console.log(options)

    document.querySelector('.save-status').innerText = 'Saving...';
    
    try {
      const response = await fetch('/journal/new', options);
      
      if (response.status === 200) {
        document.querySelector('.save-status').innerHTML = `<div style="color: green">Last saved on ${new Date}</div>`;
        return true;
      } else {
        document.querySelector('.save-status').innerHTML = '<div style="color: red">Failed to Save<div>';
      }
    } catch(error) {
      console.error(error);
      document.querySelector('.save-status').innerText = 'Failed to Save';
      return false;
    }
  });
})