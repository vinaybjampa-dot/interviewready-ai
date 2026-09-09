import os
import sys
import base64
import urllib.request
import urllib.error
import json

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Project root path
PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))

# Exclude list for git upload
EXCLUDE_DIRS = {
    'node_modules', '.git', '__pycache__', '.pytest_cache', 
    'venv', '.venv', 'dist', 'build', '.idea', '.vscode'
}

EXCLUDE_FILES = {
    'interviewready.db', 'mingit.zip', '.DS_Store'
}

def get_all_project_files(base_dir):
    file_list = []
    for root, dirs, files in os.walk(base_dir):
        # Prune excluded directories
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        for f in files:
            if f in EXCLUDE_FILES or f.endswith('.pyc'):
                continue
            full_path = os.path.join(root, f)
            rel_path = os.path.relpath(full_path, base_dir).replace('\\', '/')
            file_list.append((rel_path, full_path))
    return file_list

def create_github_repo(token, repo_name, private=False):
    url = "https://api.github.com/user/repos"
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "InterviewReady-Uploader"
    }
    payload = {
        "name": repo_name,
        "description": "InterviewReady AI - Full-Stack AI Placement Interview Coach for B.Tech Students",
        "private": private,
        "auto_init": True
    }
    req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers=headers, method='POST')
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            print(f"✅ Repository created: {data.get('html_url')}")
            return data.get('owner', {}).get('login'), data.get('name')
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode('utf-8')
        if e.code == 422: # Already exists
            print(f"⚠️ Repository '{repo_name}' already exists. Uploading files into existing repository...")
            # Fetch user login
            req_user = urllib.request.Request("https://api.github.com/user", headers=headers)
            with urllib.request.urlopen(req_user) as resp_user:
                u_data = json.loads(resp_user.read().decode('utf-8'))
                return u_data.get('login'), repo_name
        else:
            print(f"❌ Failed to create repo: {e.code} - {err_msg}")
            sys.exit(1)

def upload_file_to_github(token, owner, repo, rel_path, full_path):
    url = f"https://api.github.com/repos/{owner}/{repo}/contents/{rel_path}"
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "InterviewReady-Uploader"
    }

    # Check if file exists to get SHA
    sha = None
    try:
        get_req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(get_req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            sha = data.get('sha')
    except urllib.error.HTTPError:
        pass

    with open(full_path, 'rb') as f:
        content = base64.b64encode(f.read()).decode('utf-8')

    payload = {
        "message": f"Add/Update {rel_path}",
        "content": content
    }
    if sha:
        payload["sha"] = sha

    req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers=headers, method='PUT')
    try:
        with urllib.request.urlopen(req) as resp:
            print(f"  ✓ Uploaded: {rel_path}")
    except Exception as e:
        print(f"  ❌ Error uploading {rel_path}: {e}")

def main():
    print("=" * 60)
    print("  InterviewReady AI - GitHub Repository Uploader")
    print("=" * 60)

    token = os.environ.get("GITHUB_TOKEN")
    if not token:
        if len(sys.argv) > 1:
            token = sys.argv[1]
        else:
            token = input("\nEnter your GitHub Personal Access Token (PAT): ").strip()

    if not token:
        print("❌ Error: GitHub token required!")
        sys.exit(1)

    repo_name = "interviewready-ai"
    if len(sys.argv) > 2:
        repo_name = sys.argv[2]

    print("\n📦 Scanning project files...")
    files = get_all_project_files(PROJECT_DIR)
    print(f"Found {len(files)} files to upload.")

    print("\n🚀 Creating repository on GitHub...")
    owner, repo = create_github_repo(token, repo_name)

    print(f"\n📤 Uploading files to https://github.com/{owner}/{repo} ...")
    for rel_path, full_path in files:
        upload_file_to_github(token, owner, repo, rel_path, full_path)

    print("\n" + "=" * 60)
    print(f"🎉 SUCCESS! All files pushed to your GitHub repository:")
    print(f"👉 https://github.com/{owner}/{repo}")
    print("=" * 60)

if __name__ == "__main__":
    main()
