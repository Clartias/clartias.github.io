document.getElementById('dropArea').addEventListener('dragover', (event) => {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    document.getElementById('dropArea').classList.add('drag-over');
});

document.getElementById('dropArea').addEventListener('dragleave', (event) => {
    document.getElementById('dropArea').classList.remove('drag-over');
});

document.getElementById('dropArea').addEventListener('drop', (event) => {
    event.stopPropagation();
    event.preventDefault();

    var files = event.dataTransfer.files;

    if (files.length > 0) {
        var file = files[0];
        document.getElementById('fileName').textContent = file.name;
        document.getElementById('fileInfo').style.display = 'block';

        storeFileClientSide(file);
        simulateApiRequest(file);
    }

    document.getElementById('dropArea').classList.remove('drag-over');
});

document.getElementById('videoFile').addEventListener('change', function(event) {
    if (this.files.length > 0) {
        var file = this.files[0];
        document.getElementById('fileName').textContent = file.name;
        document.getElementById('fileInfo').style.display = 'block';
    }
});

document.getElementById('cancelButton').addEventListener('click', function() {
    document.getElementById('videoFile').value = '';
    document.getElementById('fileInfo').style.display = 'none';
});

function displayVideoThumbnail(file) {
    var thumbnail = document.getElementById('thumbnail');
    var reader = new FileReader();
    reader.onload = function(e) {
        thumbnail.src = e.target.result;
        thumbnail.style.display = 'block';
    };
    reader.readAsDataURL(file);
    document.getElementById('audioIcon').style.display = 'none';
}

function displayAudioIcon() {
    document.getElementById('thumbnail').style.display = 'none';
    document.getElementById('audioIcon').style.display = 'block';
}

function storeFileClientSide(file) {
    var reader = new FileReader();
    reader.onload = function(e) {
        console.log('File stored client-side (simulated)');
    };
    reader.readAsDataURL(file);
}

function simulateApiRequest(file) {
    var progressBar = document.getElementById('uploadProgress');
    progressBar.value = 0;

    var uploadInterval = setInterval(function() {
        if (progressBar.value < 100) {
            progressBar.value += 10;
        } else {
            clearInterval(uploadInterval);
            alert('API request simulated: ' + file.name);
        }
    }, 200);
}

function uploadVideo() {
    var fileInput = document.getElementById('videoFile');
    if (fileInput.files.length > 0) {
        var file = fileInput.files[0];
        alert('File ready for upload: ' + file.name);
    } else {
        alert('Please select or drop a file to upload.');
    }
}
