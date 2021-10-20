MYSQL_NAME?=mysql
MYSQL_IMAGE=mysql:8.0
MYSQL_PASSWORD=xpto
MYSQL_VOLUME_PATH?=/home/database/mysql/data
APP_NAME=monthly-budget-manager
APP_DIR = /dev/${APP_NAME}/src
PORT=3003
DOCKER_BASE_IMAGE=node:14.18

mysql:
	@echo "\e[1m\033[33mStarting MySQL on port 3306\e[0m"
	@docker run -p 3306:3306 --name ${MYSQL_NAME} \
		-v ${MYSQL_VOLUME_PATH}:/var/lib/mysql \
		-e MYSQL_ROOT_PASSWORD="${MYSQL_PASSWORD}" \
		-d ${MYSQL_IMAGE}

ip:
	@echo ${MYSQL_NAME}
	@docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' \
		${MYSQL_NAME}
	@echo ${APP_NAME}
	@docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' ${APP_NAME}

remove-containers:
ifneq ($(shell docker ps -a --filter "name=${APP_NAME}" -aq 2> /dev/null | wc -l | bc), 0)
	@echo "\e[1m\033[33mRemoving containers\e[0m"
	@docker ps -a --filter "name=${APP_NAME}" -aq | xargs docker rm -f
endif

docker-command: remove-containers
	@docker run -it -v $(shell pwd):${APP_DIR} -w ${APP_DIR} \
		-p ${PORT}:${PORT} --name ${APP_NAME} \
		${DOCKER_BASE_IMAGE} bash -c "${COMMAND}"

start:
	@clear
	@echo "\e[1m\033[33mRunning ${APP_NAME} on port ${PORT}\e[0m"
	@make docker-command COMMAND="yarn dev"
