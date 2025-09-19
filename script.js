// SELECTORS
const todoForm = document.querySelector('.todo-form');
const todoInput = document.querySelector('.todo-input');
const todoDate = document.querySelector('.todo-date');
const todoList = document.querySelector('.todo-list');
const filterMenu = document.querySelector('.filter-menu');
const searchInput = document.querySelector('.search-input'); // BARU

// EVENT LISTENERS
todoForm.addEventListener('submit', addTodo);
todoList.addEventListener('click', handleTodoClick);
filterMenu.addEventListener('click', handleFilter);
searchInput.addEventListener('keyup', filterTasksByText); // BARU

// FUNCTIONS

/**
 * Menambahkan to-do baru saat form disubmit.
 */
function addTodo(event) {
    // Mencegah form dari refresh halaman
    event.preventDefault();

    // Validasi input: tidak boleh kosong
    if (todoInput.value.trim() === '') {
        alert("Please enter a task description.");
        return;
    }

    // Buat elemen <li> utama
    const todoLi = document.createElement('li');
    todoLi.classList.add('todo');

    // Buat div untuk konten (teks dan tanggal)
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('todo-content');

    // Buat elemen <p> untuk teks to-do
    const todoText = document.createElement('p');
    todoText.innerText = todoInput.value;
    todoText.classList.add('todo-text');
    contentDiv.appendChild(todoText);
    
    // Tambahkan tanggal jika diisi
    if(todoDate.value) {
        const dateText = document.createElement('p');
        const formattedDate = new Date(todoDate.value).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
        dateText.innerText = formattedDate;
        dateText.classList.add('todo-item-date');
        contentDiv.appendChild(dateText);
    }
    
    todoLi.appendChild(contentDiv);

    // Buat div untuk tombol aksi
    const actionBtnsDiv = document.createElement('div');
    actionBtnsDiv.classList.add('action-btns');

    // Tombol Selesai (Check)
    const completeButton = document.createElement('button');
    completeButton.innerHTML = '<i class="fas fa-check-circle"></i>';
    completeButton.classList.add('complete-btn');
    actionBtnsDiv.appendChild(completeButton);

    // Tombol Hapus (Trash)
    const trashButton = document.createElement('button');
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add('trash-btn');
    actionBtnsDiv.appendChild(trashButton);

    todoLi.appendChild(actionBtnsDiv);

    // Tambahkan <li> ke dalam <ul>
    todoList.appendChild(todoLi);

    // Kosongkan input field setelah submit
    todoInput.value = '';
    todoDate.value = '';
}

/**
 * Menangani klik pada tombol check atau delete.
 */
function handleTodoClick(event) {
    const item = event.target;
    const todo = item.closest('.todo'); // Dapatkan elemen <li> terdekat

    if (!todo) return;

    // Aksi untuk tombol hapus
    if (item.closest('.trash-btn')) {
        todo.classList.add('fall'); // Tambahkan animasi jatuh
        // Hapus elemen setelah animasi selesai
        todo.addEventListener('transitionend', function() {
            todo.remove();
        });
    }

    // Aksi untuk tombol selesai
    if (item.closest('.complete-btn')) {
        todo.classList.toggle('completed');
    }
}

/**
 * Memfilter to-do list berdasarkan kategori (all, uncompleted, completed).
 */
function handleFilter(event) {
    const filterValue = event.target.dataset.filter;
    if (!filterValue) return; // Keluar jika yang diklik bukan tombol filter

    // Atur kelas 'active' pada tombol yang diklik
    const filterButtons = filterMenu.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    const todos = todoList.childNodes;
    todos.forEach(function(todo) {
        // Lewati node yang bukan elemen (seperti #text)
        if (todo.nodeType !== Node.ELEMENT_NODE) return;

        switch (filterValue) {
            case 'all':
                todo.style.display = 'flex';
                break;
            case 'completed':
                if (todo.classList.contains('completed')) {
                    todo.style.display = 'flex';
                } else {
                    todo.style.display = 'none';
                }
                break;
            case 'uncompleted':
                if (!todo.classList.contains('completed')) {
                    todo.style.display = 'flex';
                } else {
                    todo.style.display = 'none';
                }
                break;
        }
    });
}

/**
 * BARU: Fungsi untuk memfilter tugas berdasarkan teks dari input pencarian.
 */
function filterTasksByText(event) {
    const searchTerm = event.target.value.toLowerCase();
    const todos = todoList.querySelectorAll('.todo');

    todos.forEach(function(todo) {
        const taskText = todo.querySelector('.todo-text').innerText.toLowerCase();
        
        // Cek apakah teks tugas mengandung kata kunci pencarian
        if (taskText.includes(searchTerm)) {
            todo.style.display = 'flex'; // Tampilkan jika cocok
        } else {
            todo.style.display = 'none'; // Sembunyikan jika tidak cocok
        }
    });
    // Catatan: Fungsi ini akan menimpa filter "Active/Completed".
    // Untuk pengembangan lebih lanjut, logika filter bisa digabungkan.
}