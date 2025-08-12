#!/usr/bin/env python3
"""
Build and prepare standalone dataframe for publishing.
This script runs the standalone build and copies it to the frontend code directory.
"""

import pathlib
import shutil
import subprocess


def build_and_copy_standalone_dataframe():
    """Build standalone dataframe and copy to frontend code directory."""
    repo_root = pathlib.Path(__file__).resolve().parents[1]
    standalone_dir = repo_root / "js" / "dataframe" / "standalone"
    dest_dir = repo_root / "gradio" / "_frontend_code" / "dataframe"
    
    print(f"Building standalone dataframe from {standalone_dir}")
    
    # Install dependencies first
    try:
        subprocess.run(
            ["npm", "install"], 
            cwd=str(standalone_dir), 
            check=True,
            capture_output=True,
            text=True
        )
        print("✅ Dependencies installed")
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        print(f"stdout: {e.stdout}")
        print(f"stderr: {e.stderr}")
        raise
    
    # Run the standalone build
    try:
        subprocess.run(
            ["npm", "run", "build"], 
            cwd=str(standalone_dir), 
            check=True,
            capture_output=True,
            text=True
        )
        print("✅ Standalone dataframe build completed")
    except subprocess.CalledProcessError as e:
        print(f"❌ Standalone dataframe build failed: {e}")
        print(f"stdout: {e.stdout}")
        print(f"stderr: {e.stderr}")
        raise
    
    # Copy standalone files to frontend code directory
    def ignore_files(d, names):
        ignored = []
        for n in names:
            if (
                n.startswith("CHANGELOG")
                or n.startswith("README.md") 
                or n.startswith("node_modules")
                or n == "package.json"  # Preserve original package.json
                or ".test." in n
                or ".stories." in n
                or ".spec." in n
            ):
                ignored.append(n)
        return ignored
    
    print(f"Copying standalone dataframe to {dest_dir}")
    shutil.copytree(
        str(standalone_dir),
        str(dest_dir),
        ignore=ignore_files,
        dirs_exist_ok=True,
    )
    print("✅ Standalone dataframe copied successfully")


if __name__ == "__main__":
    build_and_copy_standalone_dataframe()