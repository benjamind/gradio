#!/usr/bin/env python3
"""
Build standalone dataframe and copy to frontend code directory.
"""

import pathlib
import shutil
import subprocess


def build_and_copy_standalone_dataframe():
    """Build standalone dataframe and copy to frontend code directory."""
    repo_root = pathlib.Path(__file__).resolve().parents[1]
    standalone_dir = repo_root / "js" / "dataframe" / "standalone"
    dest_dir = repo_root / "gradio" / "_frontend_code" / "dataframe"

    try:
        subprocess.run(["npm", "install"], cwd=str(standalone_dir), check=True)
        subprocess.run(["npm", "run", "build"], cwd=str(standalone_dir), check=True)
    except subprocess.CalledProcessError as e:
        print(f"Build failed: {e}")
        raise

    def ignore_files(d, names):
        ignored = []
        for n in names:
            if (
                n.startswith("CHANGELOG")
                or n.startswith("node_modules")
                or n == "package.json"
                or ".test." in n
                or ".stories." in n
                or ".spec." in n
            ):
                ignored.append(n)
        return ignored

    shutil.copytree(
        str(standalone_dir), str(dest_dir), ignore=ignore_files, dirs_exist_ok=True
    )


if __name__ == "__main__":
    build_and_copy_standalone_dataframe()
