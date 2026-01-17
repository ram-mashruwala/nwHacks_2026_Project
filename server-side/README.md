# Installation

## Create virtual python environment

```
python -m venv venv
```

## Activate the virtual environment

### Windows

<details><summary>Windows</summary>
If you are using cmd

```sh
venv\Scripts\activate
```

If you are using powershell

```sh
.\venv\Scripts\Activate.ps1
```

</details>

<details><summary> Linux and Mac </summary>

```sh
source venv/bin/activate
```

</details>

## Install python packages

```sh
pip install -r requirements.txt
```

## Use this to run the server

```sh
flask run
```
