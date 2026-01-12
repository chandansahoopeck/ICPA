# container running passed in python (flask) application on server gunicorn 

ARG PYTHON_VERSION="python3.12"
ARG VIRTUAL_ENV="/root/python_venv"

FROM amazonlinux:2

ARG PYTHON_VERSION
ARG VIRTUAL_ENV
WORKDIR /root

RUN yum update -y
RUN yum install poppler poppler-utils ${PYTHON_VERSION} python3-pip python3-venv -y
WORKDIR /root

# create virtual environment for python
# otherwise errors since installing packages via "pip install my_package" 
# might interfere with python version used by operating system itself for regular operations tasks
RUN mkdir -p /root/python_venv
RUN python3 -m venv ${VIRTUAL_ENV}

# activating virtual environment by calling "source ${VIRTUAL_ENV}/bin/activate" 
# will cause issues as it HAS to be called from within bash 
# but docker/debian is forcing us to use /bin/sh
# so setting PATH manually which seems to be doing the trick as well
ENV PATH="${VIRTUAL_ENV}/bin:$PATH"
RUN pip install flask gunicorn requests boto3 pdf2image

COPY OcrProxy.py /root/
COPY gunicorn_config.py /root/


CMD ["/bin/sh", "-c", "gunicorn --config gunicorn_config.py  OcrProxy:app"]
