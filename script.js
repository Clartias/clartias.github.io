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

function storeFileClientSide(file) {
    var reader = new FileReader();
    reader.onload = function(e) {
        console.log('File stored client-side (simulated)');
    };
    reader.readAsDataURL(file);
}

function uploadVideo() {
    var fileInput = document.getElementById('videoFile');
    if (fileInput.files.length > 0) {
        var file = fileInput.files[0];
        var xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", updateProgress, false);
        xhr.addEventListener("load", transferComplete, false);

        xhr.open("PUT", "https://wrcqcwfqbb.execute-api.us-east-1.amazonaws.com/uploads");
        xhr.setRequestHeader("Content-Type", "application/octet-stream");
        xhr.send(file);
    } else {
        alert('Please select or drop a file to upload.');
    }
}

function updateProgress(e) {
    if (e.lengthComputable) {
        var percentComplete = e.loaded / e.total * 100;
        var progressBar = document.getElementById('uploadProgress');
        progressBar.value = percentComplete;
    }
}

function transferComplete(e) {
    alert("Upload complete.");
}
