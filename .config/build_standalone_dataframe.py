#!/usr/bin/env python3
"""
Build standalone dataframe and copy to frontend code directory.
Simplified script that calls the comprehensive build.ts logic.
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

    # Install dependencies and run build (build.ts handles all the logic)
    try:
        subprocess.run(["npm", "install"], cwd=str(standalone_dir), check=True)
        subprocess.run(["npm", "run", "build"], cwd=str(standalone_dir), check=True)
        print("✅ Standalone dataframe built successfully")
    except subprocess.CalledProcessError as e:
        print(f"❌ Build failed: {e}")
        raise

    # Copy built files to frontend code directory
    def ignore_files(d, names):
        ignored = []
        for n in names:
            if (
                n.startswith("CHANGELOG")
                or n.startswith("node_modules")
                or n == "package.json"  # Preserve original package.json
                or ".test." in n
                or ".stories." in n
                or ".spec." in n
            ):
                ignored.append(n)
        return ignored

    print(f"Copying standalone dataframe to {dest_dir}")
    shutil.copytree(str(standalone_dir), str(dest_dir), ignore=ignore_files, dirs_exist_ok=True)
    print("✅ Standalone dataframe copied successfully")


if __name__ == "__main__":
    build_and_copy_standalone_dataframe()
