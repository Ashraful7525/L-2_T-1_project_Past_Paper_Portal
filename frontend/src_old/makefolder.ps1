# Create folders
$folders = @(
    "components",
    "pages"
)

foreach ($folder in $folders) {
    if (-not (Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder | Out-Null
    }
}

# Create component files
$componentFiles = @(
    "components/UserList.js",
    "components/DepartmentSelect.js",
    "components/CourseSelect.js",
    "components/LevelSelect.js",
    "components/TermSelect.js",
    "components/QuestionList.js",
    "components/QuestionForm.js",
    "components/SolutionForm.js",
    "components/CommentForm.js",
    "components/VoteButton.js"
)

foreach ($file in $componentFiles) {
    if (-not (Test-Path $file)) {
        New-Item -ItemType File -Path $file | Out-Null
    }
}

# Create page files
$pageFiles = @(
    "pages/HomePage.js",
    "pages/QuestionsPage.js",
    "pages/AddQuestionPage.js",
    "pages/AddSolutionPage.js",
    "pages/UserPage.js"
)

foreach ($file in $pageFiles) {
    if (-not (Test-Path $file)) {
        New-Item -ItemType File -Path $file | Out-Null
    }
}

# Create api.js, App.js if not exists
$rootFiles = @(
    "api.js",
    "App.js"
)

foreach ($file in $rootFiles) {
    if (-not (Test-Path $file)) {
        New-Item -ItemType File -Path $file | Out-Null
    }
}

Write-Host "Frontend React structure created successfully!"
