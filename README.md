# Toast bot ![alt text](https://github.com/js-all/bot2/raw/master/icon.png "i know it's way too big")

## how to uses

### 1. clone the repository:

```shell
$ git clone https://github.com/js-all/bot2.git
```

### 2. install the modules and typescript if nescessary

```shell
$ npm i
```

### 3. compile the typescript

```shell
$ npx tsc -w
```

### 4. run it once and exit with ctrl+c

```shell
$ npm start
```

### 5. edit the conf.json file and put your application token

```json
{
  "prefix": "..",
  "token": "YOUR TOKEN HERE"
}
```

### 6. and you'r good to go just run it again and it will work

```shell
 $ npm start
```

### conf.json

prefix: the command prefix,
token: the bot application token,
banMessage: the ban message when a command is banned from a user,
newYearChannel: the channel in wich the new year message will be sent, none if none
