Usage: Automated push script

Run from the repository root in PowerShell. Example:

```powershell
# normal push (non-destructive)
.\scripts\push_to_github.ps1 -RemoteUrl "https://github.com/youruser/yourrepo.git" -Branch main

# force overwrite remote (destructive)
.\scripts\push_to_github.ps1 -RemoteUrl "https://github.com/youruser/yourrepo.git" -Branch main -Force
```

Notes:

- The script will abort any in-progress rebase, add or replace the `origin` remote, create a commit if there are local changes, and push.
- For HTTPS private repos, use a Personal Access Token when prompted.
- Review the script before running, especially when using `-Force`.
