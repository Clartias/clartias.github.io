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

        uploadFile(file);
    }

    document.getElementById('dropArea').classList.remove('drag-over');
});

document.getElementById('videoFile').addEventListener('change', function (event) {
    if (this.files.length > 0) {
        var file = this.files[0];
        document.getElementById('fileName').textContent = file.name;
        document.getElementById('fileInfo').style.display = 'block';

        uploadFile(file);
    }
});

document.getElementById('cancelButton').addEventListener('click', function () {
    document.getElementById('videoFile').value = '';
    document.getElementById('fileInfo').style.display = 'none';
});

function isFileSizeValid(file) {
    const MAX_SIZE = 1024 * 1024 * 1024; // 1GB in bytes
    return file.size <= MAX_SIZE;
}

function getPresignedUrl(file) {
    return fetch(`https://wrcqcwfqbb.execute-api.us-east-1.amazonaws.com/uploads?filename=${encodeURIComponent(file.name)}&filetype=${encodeURIComponent(file.type)}`)
        .then(response => response.json())
        .then(data => data.uploadURL);
}

function uploadFile(file) {
    if (!isFileSizeValid(file)) {
        alert('File size exceeds the 1GB limit.');
        return;
    }

    getPresignedUrl(file).then(uploadUrl => {
        var xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", updateProgress, false);
        xhr.addEventListener("load", transferComplete, false);

        xhr.open("PUT", uploadUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
    }).catch(error => {
        console.error("Error getting a signed URL or uploading the file:", error);
    });
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
