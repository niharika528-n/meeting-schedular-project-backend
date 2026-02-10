Param(
    [Parameter(Mandatory=$true)]
    [string]$RemoteUrl,
    [string]$Branch = "main",
    [string]$CommitMessage = "Automated commit: sync local changes",
    [switch]$Force
)

function Exec-Git {
    param([string[]]$Args)
    & git @Args 2>&1
    return $LASTEXITCODE
}

Write-Output "Starting automated push to $RemoteUrl on branch $Branch"

# Abort any in-progress rebase (best-effort)
try { git rebase --abort 2>$null } catch { }

# Remove origin if it exists
$null = & git remote get-url origin 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Output "Removing existing 'origin' remote"
    git remote remove origin
}

Write-Output "Adding remote origin -> $RemoteUrl"
git remote add origin $RemoteUrl
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to add remote origin. Verify the URL and credentials."; exit 1
}

# Ensure local branch name
git branch -M $Branch

# Stage and commit only if there are changes
$porcelain = git status --porcelain
if ($porcelain) {
    Write-Output "Local changes detected — creating a commit"
    git add --all
    git commit -m "$CommitMessage"
    if ($LASTEXITCODE -ne 0) { Write-Error "Commit failed"; exit 1 }
} else {
    Write-Output "No local changes to commit"
}

# Push (force if requested)
$pushArgs = @('push','-u','origin',$Branch)
if ($Force) { $pushArgs += '--force' }
Write-Output "Running: git $($pushArgs -join ' ')"
& git @pushArgs
if ($LASTEXITCODE -ne 0) {
    Write-Error "Push failed. Check remote URL, access rights, and network connectivity."; exit 1
}

Write-Output "Push completed successfully."
