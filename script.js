let selectedFile;

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
    document.getElementById('dropArea').classList.remove('drag-over');

    var files = event.dataTransfer.files;
    handleFileSelection(files);
});

document.getElementById('videoFile').addEventListener('change', function (event) {
    handleFileSelection(this.files);
});

document.getElementById('cancelButton').addEventListener('click', function () {
    resetForm();
});

document.getElementById('submitButton').addEventListener('click', function () {
    const email = document.getElementById('emailField').value;
    const submitButton = document.getElementById('submitButton');
    if (email && selectedFile) {
        submitButton.disabled = true; // Disable the submit button
        submitButton.textContent = 'Uploading...'; // Optional: change button text
        uploadFile(selectedFile, email, function() {
            submitButton.disabled = false; // Re-enable the button after the upload
            submitButton.textContent = 'Submit!'; // Optional: reset button text
        });
    } else {
        alert('Please select a file and enter your email address.');
    }
});

function handleFileSelection(files) {
    if (files.length > 0) {
        selectedFile = files[0];

        if (!isFileSizeValid(selectedFile)) {
            alert('File size exceeds the 1GB limit.');
            return;
        }

        document.getElementById('fileName').textContent = selectedFile.name;
        document.getElementById('fileInfo').style.display = 'block';
    }
}

function resetForm() {
    document.getElementById('videoFile').value = '';
    document.getElementById('fileInfo').style.display = 'none';
    selectedFile = null;
}

function isFileSizeValid(file) {
    const MAX_SIZE = 1024 * 1024 * 1024; // 1GB in bytes
    return file.size <= MAX_SIZE;
}

function getPresignedUrl(file, email) {
    const filename = encodeURIComponent(email + '-' + file.name);
    return fetch(`https://wrcqcwfqbb.execute-api.us-east-1.amazonaws.com/uploads?filename=${filename}&filetype=${encodeURIComponent(file.type)}`)
        .then(response => response.json())
        .then(data => data.uploadURL);
}

function uploadFile(file, email, callback) {
    getPresignedUrl(file, email).then(uploadUrl => {
        var xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", updateProgress, false);
        xhr.addEventListener("load", function() {
            transferComplete();
            callback(); // Call the callback function to re-enable the button
        }, false);
        xhr.addEventListener("error", callback); // Re-enable the button in case of error
        xhr.addEventListener("abort", callback); // Re-enable the button if the transfer is cancelled

        xhr.open("PUT", uploadUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
    }).catch(error => {
        console.error("Error getting a signed URL or uploading the file:", error);
        callback(); // Re-enable the button in case of error
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
    resetForm();
}
