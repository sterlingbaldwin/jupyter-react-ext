import setuptools

with open("README.md", "r") as fh:
    long_description = fh.read()

setuptools.setup(
    name='vcs_backend',
    version='0.0.2',
    author='Sterling Baldwin',
    description="A server extension for jupyterlab-vcs",
    long_description=long_description,
    long_description_content_type="application/netcdf",
    packages=setuptools.find_packages(),
    install_requires=[
        'notebook',
    ],
    package_data={'vcs_backend': ['*']},
)
