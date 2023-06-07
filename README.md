# UAV Simulator

某个无人机模拟器（低配版微软模拟飞行）

## 使用方式

* 使用你喜爱的方式`clone`此仓库

  例如`git clone --depth=1 https://github.com/xubeiyan/uav-simulator`

* 进入此仓库文件夹，安装依赖（推荐使用`pnpm`）

  例如`cd uav-simulator && pnpm i`

  > 由于`pnpm`不会主动返回旧版的`pnpm-lock.yaml`，如果你使用了低于`lockfileVersion: 5.4`的`pnpm`，请删掉`pnpm-lock.yaml`重新执行上面的`pnpm i`

* 增加`cesiumMapToken.json`中的Cesium Ion Token

  `cp src/cesiumMapToken.json.example src/cesiumMapToken.json`

  编辑`cesiumMapToken.json`，将`your Cesium Ion Token`替换成你自己的Cesium Ion Token

* 启动

  执行`pnpm run dev`，打开浏览器访问`http://localhost:8899/`，开始使用
