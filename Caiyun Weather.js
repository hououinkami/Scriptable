/**
彩云天气 for Scriptable
@author: https://github.com/hououinkami/Scriptable
Thanks to https://github.com/mzeryck
*/

/*
自定义配置
*/

// 彩云天气API（https://caiyunapp.com自行申请）
const apiKey = ""
// 语言选项：日语ja，中文zh_CN，英文en，留空则跟随iOS系统设置
let lang = "zh_CN"
if (lang == "" || lang == null) { lang = Device.locale() }
// 是否使用动态定位
const autoLocation = true
// 预览尺寸
const widgetPreview = "medium"
// 是否使用自定义背景图片，否则采用纯色背景
const imageBackground = true
// 重置背景图片
const forceImageUpdate = false
// 各项目间的间隔（若有），默认10
const padding = 10
// 是否使用iCloud存储缓存
const useiCloud = true
// 缓存文件存储位置
const files = useiCloud ? FileManager.iCloud() : FileManager.locale()
// 为缓存文件建立二级文件夹（仅适用于iCloud，请手动在iCloud Drive的Scriptable文件夹中手动建立Cache文件夹）
const folder = useiCloud ? "/Cache" : ""
// 天气设置项
const weatherSettings = {
  // 摄氏度metric，华氏度imperial
  units: "metric"
  // 是否显示当前定位
  ,showLocation: true
  // 是否显示天气概况文字信息
  ,showCondition: false
  // 是否显示自然语义天气
  ,showKeypoint: true
  // 是否显示当日最高气温和最低气温
  ,showHighLow: true
  // 是否显示更新时间
  ,showUpdatetime: true
  // 从几点开始显示明日气温（24则为用不显示）
  ,tomorrowShownAtHour: 22
}

// 本地化
if (lang == "ja") {
  var localizedText = {
    // 风
    kyu: "級"
    ,n: "北"
    ,nen: "北北東"
    ,ne: "北東"
    ,nee: "東北東"
    ,e: "東"
    ,see: "東南東"
    ,se: "南東"
    ,ses: "南南東"
    ,s: "南"
    ,sws: "南南西"
    ,sw: "南西"
    ,sww: "西南西"
    ,w: "西"
    ,nww: "西北西"
    ,nw: "北西"
    ,nwn: "北北西"
    // 详细信息
    ,apparent: "体感温度"
    ,humidity: "湿度"
    ,windSpeed: "風力"
    ,windDirection: "風向"
    ,UV: "UV指数"
    ,AQ: "空気質量"
    // 标签
    ,nextHourLabel: "次の１時間"
    ,tomorrowLabel: "明日"
    // 天气
    ,clear: "晴れ"
    ,partlyCloudy: "どころにより曇り"
    ,cloudy: "曇り"
    ,lightHaze: "もや"
    ,moderateHaze: "もや"
    ,heavyHaze: "もや"
    ,lightRain: "にわか雨"
    ,moderateRain: "やや強い雨"
    ,heavyRain: "激しい雨"
    ,stormRain: "豪雨"
    ,lightSnow: "小雪"
    ,moderateSnow: "やや強い雪"
    ,heavySnow: "大雪"
    ,stormSnow: "豪雪"
    ,dust: "浮遊粉塵"
    ,sand: "砂ほこり"
    ,wind: "風"
    
  } 
} else {
  var localizedText = {
    // 风
    kyu: "级"
    ,n: "北"
    ,nen: "东北北"
    ,ne: "东北"
    ,nee: "东北东"
    ,e: "东"
    ,see: "东南偏东"
    ,se: "东南"
    ,ses: "东南南"
    ,s: "南"
    ,sws: "西南南"
    ,sw: "西南"
    ,sww: "西南西"
    ,w: "西"
    ,nww: "西北西"
    ,nw: "西北"
    ,nwn: "西北北"
    // 详细信息
    ,apparent: "体感温度"
    ,humidity: "湿度"
    ,windSpeed: "风力"
    ,windDirection: "风向"
    ,UV: "紫外线"
    ,AQ: "空气质量"
    // 标签
    ,nextHourLabel: "下一小时"
    ,tomorrowLabel: "明天"
    // 天气
    ,clear: "晴"
    ,partlyCloudy: "局部多云"
    ,cloudy: "阴"
    ,lightHaze: "雾霾"
    ,moderateHaze: "雾霾"
    ,heavyHaze: "雾霾"
    ,lightRain: "小雨"
    ,moderateRain: "中雨"
    ,heavyRain: "大雨"
    ,stormRain: "暴雨"
    ,lightSnow: "小雪"
    ,moderateSnow: "中雪"
    ,heavySnow: "大雪"
    ,stormSnow: "暴雪"
    ,dust: "浮尘"
    ,sand: "沙尘"
    ,wind: "大风"

  }
}
// 图标大小及文本格式：字体信息详见iosfonts.com，若使用iOS默认字体，字体名称采用: ultralight, light, regular, medium, semibold, bold, heavy, black, or italic.
const iconSize = {
  large: 30
  ,small: 18
}
const textFormat = {
  // 默认
  defaultText: { size: 14, color: "ffffff", font: "regular" },
  // 放空则采用默认设置
  // 定位
  location:    { size: 8, color: "", font: "" },
  // 实时天气
  keyword:    { size: 12, color: "", font: "" },
  // 实时温度
  currentTemp: { size: 34, color: "", font: "light" },
  // 温度条高低温
  tinyTemp:    { size: 12, color: "", font: "" },
  // 自然语义天气
  keypoint:   { size: 15, color: "", font: "" },
  // 明日或下一小时标签
  label:   { size: 14, color: "", font: "" },
  // 下一小时温度
  smallTemp:   { size: 14, color: "", font: "" },
  // 信息标签
  infoLabel:    { size: 9, color: "", font: "" },
  // 值
  infoNum:    { size: 15, color: "", font: "" },



  smallDate:   { size: 17, color: "", font: "semibold" },
  largeDate1:  { size: 30, color: "", font: "light" },
  largeDate2:  { size: 30, color: "", font: "light" },
  greeting:    { size: 18, color: "", font: "semibold" },
  eventLabel:  { size: 14, color: "", font: "semibold" },
  eventTitle:  { size: 14, color: "", font: "semibold" },
  eventTime:   { size: 14, color: "ffffffcc", font: "" },
  noEvents:    { size: 30, color: "", font: "semibold" },
  largeTemp:   { size: 34, color: "", font: "light" },
  
  
  customText:  { size: 14, color: "", font: "" },
  battery:    { size: 18, color: "", font: "medium" },
  mediumTemp:   { size: 15, color: "", font: "" },
  tinyName:    { size: 9, color: "", font: "" },
  mediumName:   { size: 14, color: "", font: "" },
}

/*
布局
*/
//详细说明稍后补充
const items = [
  
  row,
  
     column,
     left,
     currentLocation,

     column,
     right,
     severTime,

     
  row,

     column,
     left,
     current,

     column,
     right,
     space,
     keyPoint,
     space,
     
  row,
  
    column,
    left,
    space(3),
    currentInfo,
    
    column,
    right,
    space(5),
    future,

  
]

/*
构建小组件
*/
// 声明变量
var locationData, sunData, weatherData
// 定义全局变量
const currentDate = new Date()
const widget = new ListWidget()
const horizontalPad = padding < 10 ? 10 - padding : 10
const verticalPad = padding < 15 ? 15 - padding : 15
widget.setPadding(horizontalPad, verticalPad, horizontalPad, verticalPad)
widget.spacing = 0
var currentRow = {}
var currentColumn = {}
// 初始化对齐方式
var currentAlignment = alignLeft
// ASCII方式专属变量
var currentColumns = []
var rowNeedsSetup = false
if (typeof items[0] == 'string') {
  for (line of items[0].split(/\r?\n/)) { await processLine(line) }
}
// Otherwise, set up normally.
else {
  for (item of items) { await item(currentColumn) }
}

/*
背景图片或颜色
*/
if (imageBackground) {
  // 判断是否已缓存及其日期
  const path = files.joinPath(files.documentsDirectory() + folder, "caiyun_image")
  const exists = files.fileExists(path)
  // 如果缓存存在且无需强行更新，则直接使用缓存
  if (exists && (config.runsInWidget || !forceImageUpdate)) {
    widget.backgroundImage = files.readImage(path)
  // 如果在小组件模式下运行且无缓存，则采用灰色纯色背景
  } else if (!exists && config.runsInWidget) {
      widget.backgroundColor = Color.gray() 
  // 如果在App内运行且无缓存，则建立新缓存
  } else {
      // const img = await Photos.fromLibrary()
      let img = await generateBackground()
      widget.backgroundImage = img
      files.writeImage(path, img)
  }
// 若不使用图片，则根据日出日落时间采用纯色背景
} else {
  let gradient = new LinearGradient()
  let gradientSettings = await setupGradient()
  gradient.colors = gradientSettings.color()
  gradient.locations = gradientSettings.position()
  widget.backgroundGradient = gradient
}
// 预览小组件
Script.setWidget(widget)
if (widgetPreview == "small") { widget.presentSmall() }
else if (widgetPreview == "medium") { widget.presentMedium() }
else if (widgetPreview == "large") { widget.presentLarge() }
Script.complete()

/*
 * ASCII函数集
 * Now isn't this a lot of fun?
 * ============================
 */
// Provide the named function.
function provideFunction(name) {
  const functions = {
    space() { return space },
    left() { return left },
    right() { return right },
    center() { return center },
    date() { return date },
    greeting() { return greeting },
    events() { return events },
    current() { return current },
    future() { return future },
    battery() { return battery },
    sunrise() { return sunrise },
  }
  return functions[name]
}

// Processes a single line of ASCII. 
async function processLine(lineInput) {
  // Because iOS loves adding periods to everything.
  const line = lineInput.replace(/\.+/g,'')
  // If it's blank, return.
  if (line.trim() == '') { return }
  // If it's a line, enumerate previous columns (if any) and set up the new row.
  if (line[0] == '-' && line[line.length-1] == '-') { 
    if (currentColumns.length > 0) { await enumerateColumns() }
    rowNeedsSetup = true
    return
  }
  // If it's the first content row, finish the row setup.
  if (rowNeedsSetup) { 
    row(currentColumn)
    rowNeedsSetup = false 
  }
  // If there's a number, this is a setup row.
  const setupRow = line.match(/\d+/)
  // Otherwise, it has columns.
  const items = line.split('|')
  // Iterate through each item.
  for (var i=1; i < items.length-1; i++) {
    // If the current column doesn't exist, make it.
    if (!currentColumns[i]) { currentColumns[i] = { items: [] } }
    // Now we have a column to add the items to.
    const column = currentColumns[i].items
    // Get the current item and its trimmed version.
    const item = items[i]
    const trim = item.trim()
    // If it's not a function, figure out spacing.
    if (!provideFunction(trim)) { 
      // If it's a setup row, whether or not we find the number, we keep going.
      if (setupRow) {
        const value = parseInt(trim, 10)
        if (value) { currentColumns[i].width = value }
        continue
      }
      // If it's blank and we haven't already added a space, add one.
      const prevItem = column[column.length-1]
      if (trim == '' && (!prevItem || (prevItem && !prevItem.startsWith("space")))) {
        column.push("space")
      }
      // Either way, we're done.
      continue
    }
    // Determine the alignment.
    const index = item.indexOf(trim)
    const length = item.slice(index,item.length).length
    let align
    if (index > 0 && length > trim.length) { align = "center" }
    else if (index > 0) { align = "right" }
    else { align = "left" }
    // Add the items to the column.
    column.push(align)
    column.push(trim)
  }
}
// Runs the function names in each column.
async function enumerateColumns() {
  if (currentColumns.length > 0) {
    for (col of currentColumns) {
      // If it's null, go to the next one.
      if (!col) { continue }
      // If there's a width, use the width function.
      if (col.width) {
        column(col.width)(currentColumn)
      // Otherwise, create the column normally.
      } else {
        column(currentColumn)
      }
      for (item of col.items) {
        const func = provideFunction(item)()
        await func(currentColumn)
      }
    }
    currentColumns = []
  }
}

/*
布局函数集
*/
// 添加新行
function row(input = null) {
  function makeRow() {
    currentRow = widget.addStack()
    currentRow.layoutHorizontally()
    currentRow.setPadding(0, 0, 0, 0)
    currentColumn.spacing = 0
    // 若有输入参数，则指定行宽
    if (input > 0) { currentRow.size = new Size(0,input) }
  }
  // 如果没有输入参数，则在布局声明中调用它
  if (!input || typeof input == "number") { return makeRow }
  // 否则将在生成器中调用它
  else { makeRow() }
}

//　添加新列
function column(input = null) {
  function makeColumn() {
    currentColumn = currentRow.addStack()
    currentColumn.layoutVertically()
    currentColumn.setPadding(0, 0, 0, 0)
    currentColumn.spacing = 0
    // 若有输入参数，则指定列宽
    if (input > 0) { currentColumn.size = new Size(input,0) }
  }
  // 如果没有输入参数，则在布局声明中调用它
  if (!input || typeof input == "number") { return makeColumn }
  // 否则将在生成器中调用它
  else { makeColumn() }
}

// 创建一个对齐的stack以向其添加内容
function align(column) {
  let alignmentStack = column.addStack()
  alignmentStack.layoutHorizontally()
  let returnStack = currentAlignment(alignmentStack)
  returnStack.layoutVertically()
  return returnStack
}
// 右对齐
function alignRight(alignmentStack) {
  alignmentStack.addSpacer()
  let returnStack = alignmentStack.addStack()
  return returnStack
}
// 左对齐
function alignLeft(alignmentStack) {
  let returnStack = alignmentStack.addStack()
  alignmentStack.addSpacer()
  return returnStack
}
// 居中对齐
function alignCenter(alignmentStack) {
  alignmentStack.addSpacer()
  let returnStack = alignmentStack.addStack()
  alignmentStack.addSpacer()
  return returnStack
}
// 添加间距
function space(input = null) { 
  // 按指定数值添加间距
  function spacer(column) {
    // 若无输入参数，则为自动宽度
    if (!input || input == 0) { column.addSpacer() }
    // 否则按输入参数指定宽度
    else { column.addSpacer(input) }
  }
  if (!input || typeof input == "number") { return spacer }
  else { input.addSpacer() }
}
// 更改默认对齐方式为右对齐
function right(x) { currentAlignment = alignRight }
// 更改默认对齐方式为左对齐
function left(x) { currentAlignment = alignLeft }
// 更改默认对齐方式为居中对齐
function center(x) { currentAlignment = alignCenter }

/*
小组件数据函数集
*/
// 根据日出日落时间设置纯色背景的颜色
async function setupGradient() {
  // 调用日出日落模块sunrise
  if (!sunData) { await setupSunrise() }
  let gradient = {
    dawn: {
      color() { return [new Color("142C52"), new Color("1B416F"), new Color("62668B")] },
      position() { return [0, 0.5, 1] },
    },
    sunrise: {
      color() { return [new Color("274875"), new Color("766f8d"), new Color("f0b35e")] },
      position() { return [0, 0.8, 1.5] },
    },
    midday: {
      color() { return [new Color("3a8cc1"), new Color("90c0df")] },
      position() { return [0, 1] },
    },
    noon: {
      color() { return [new Color("b2d0e1"), new Color("80B5DB"), new Color("3a8cc1")] },
      position() { return [-0.2, 0.2, 1.5] },
    },
    sunset: {
      color() { return [new Color("32327A"), new Color("662E55"), new Color("7C2F43")] },
      position() { return [0.1, 0.9, 1.2] },
    },
    twilight: {
      color() { return [new Color("021033"), new Color("16296b"), new Color("414791")] },
      position() { return [0, 0.5, 1] },
    },
    night: {
      color() { return [new Color("16296b"), new Color("021033"), new Color("021033"), new Color("113245")] },
      position() { return [-0.5, 0.2, 0.5, 1] },
    },
  }
  const sunrise = sunData.sunrise
  const sunset = sunData.sunset
  // 如果距离30分钟以内，则使用日出或日落数据
  if (closeTo(sunrise)<=15) { return gradient.sunrise }
  if (closeTo(sunset)<=15) { return gradient.sunset }
  // 若距离大于30分钟, 使用傍晚或黎明的数据
  if (closeTo(sunrise)<=45 && utcTime < sunrise) { return gradient.dawn }
  if (closeTo(sunset)<=45 && utcTime > sunset) { return gradient.twilight }
  // 否则使用夜晚的数据
  if (isNight(currentDate)) { return gradient.night }
  // 正午
  if (currentDate.getHours() == 12) { return gradient.noon }
  return gradient.midday
}

// 定位信息
async function setupLocation() {
  locationData = {}
  const locationPath = files.joinPath(files.documentsDirectory() + folder, "caiyun_location")
  // 如果采用自动定位或是缓存信息不存在，则调用iOS进行定位
  var readLocationFromFile = false
  if (autoLocation || !files.fileExists(locationPath)) {
    try {
      const location = await Location.current()
      const geocode = await Location.reverseGeocode(location.latitude, location.longitude, lang)
      locationData.latitude = location.latitude
      locationData.longitude = location.longitude
      const geo = geocode[0]
      // 市
      locationData.locality = geo.locality
      // 区
      locationData.subLocality = geo.subLocality
      // 街道
      locationData.street = (geo.thoroughfare==null) ? "" : geo.thoroughfare
      // 详细地址
      locationData.address = locationData.locality + " " + locationData.subLocality + " " + locationData.street
      files.writeString(locationPath, location.latitude + "|" + location.longitude + "|" + locationData.address)
    } catch(e) {
      // 若自动定位失败，则从缓存获取定位信息
      if (!autoLocation) { readLocationFromFile = true }
      // 如果第一次在非自动定位模式下运行失败，将无法恢复
      else { return }
    }
  }
  // 若不采用自动定位或是其它需要读取缓存的情况下
  if (!autoLocation || readLocationFromFile) {
    const locationStr = files.readString(locationPath).split("|")
    locationData.latitude = locationStr[0]
    locationData.longitude = locationStr[1]
    locationData.address = locationStr[2]
  }
}

// 获取天气信息
async function setupWeather() {
  // 调用定位
  if (!locationData) { await setupLocation() }
  // 设置缓存
  const cachePath = files.joinPath(files.documentsDirectory() + folder, "caiyun_weather")
  const cacheExists = files.fileExists(cachePath)
  const cacheDate = cacheExists ? files.modificationDate(cachePath) : 0
  var weatherDataRaw
  // 如果有缓存且距离上次请求短于1min，则直接读取缓存数据
  if (cacheExists && (currentDate.getTime() - cacheDate.getTime()) < 60000) {
    const cache = files.readString(cachePath)
    weatherDataRaw = JSON.parse(cache)
  // 否则发送请求获取天气数据
  } else {
    const weatherReq = "https://api.caiyunapp.com/v2.5/" + apiKey + "/" + locationData.longitude + "," + locationData.latitude +"/weather.json?lang=" + lang + "&unit=" + weatherSettings.units + "&dailystart=0&hourlysteps=384&dailysteps=16&alert=true"
    weatherDataRaw = await new Request(weatherReq).loadJSON()
    files.writeString(cachePath, JSON.stringify(weatherDataRaw))
  }
  // 存储天气数据
  weather = weatherDataRaw.result
  weatherData = {}
  // 更新时间
  weatherData.serverTime = weatherDataRaw.server_time * 1000
  // 一句话自然语义天气描述
  weatherData.keypoint = weather.forecast_keypoint
  // 当前温度
  weatherData.currentTemp = weather.realtime.temperature
  // 当前体感温度
  weatherData.currentAppTemp = weather.realtime.apparent_temperature
  // 当前湿度
  weatherData.currentHumidity = (weather.realtime.humidity * 100).toFixed(0)
  // 当前空气质量
  weatherData.currentAQ = weather.realtime.air_quality.description.chn
  // 当前紫外线强度
  weatherData.currentUV = weather.realtime.life_index.ultraviolet.desc
  // 当前风速
  weatherData.currentWindSpeed = mapWind(weather.realtime.wind.speed,weather.realtime.wind.direction).windSpeed
  // 当前风向
  weatherData.currentWindDir = mapWind(weather.realtime.wind.speed,weather.realtime.wind.direction).windDirection
  // 当前天气图标
  weatherData.currentSkycon = mapSkycon(weather.realtime.skycon)[0]
  // 当前风力换算后信息
  weatherData.currentWind = mapWind(weather.realtime.wind.speed,weather.realtime.wind.direction)
  // 当日最高温
  weatherData.todayHigh = (weather.daily.temperature[0].max).toFixed(0)
  // 当日最低温
  weatherData.todayLow = (weather.daily.temperature[0].min).toFixed(0)
  // 下一个小时气温
  weatherData.nextHourTemp = (weather.hourly.temperature[1].value).toFixed(0)
  // 下一个小时天气图标
  weatherData.nextHourSkycon = mapSkycon(weather.hourly.skycon[1].value)[1]
  // 明日最高温
  weatherData.tomorrowHigh = (weather.daily.temperature[1].max).toFixed(0)
  // 明日最低温
  weatherData.tomorrowLow = (weather.daily.temperature[1].min).toFixed(0)
  // 明天天气图标
  weatherData.tomorrowSkycon = mapSkycon(weather.daily.skycon[1].value)[1]
  // 预警信息
  weatherData.alert = weather.alert.content.title
}

// 存储日出日落信息
async function setupSunrise() {
  // 调用定位函数
  if (autoLocation) { await setupLocation() }
  // 设置缓存
  const sunCachePath = files.joinPath(files.documentsDirectory() + folder, "caiyun_sun")
  const sunCacheExists = files.fileExists(sunCachePath)
  const sunCacheDate = sunCacheExists ? files.modificationDate(sunCachePath) : 0
  let sunDataRaw, afterSunset
  // 如果存在当日建立的缓存，则调用
  if (sunCacheExists && sameDay(currentDate, sunCacheDate)) {
    const sunCache = files.readString(sunCachePath)
    sunDataRaw = JSON.parse(sunCache)
    // 判断是否已经日落
    const sunsetDate = new Date(sunDataRaw.sunset)
    afterSunset = currentDate.getTime() - sunsetDate.getTime() > (45 * 60 * 1000)
  }
  // 若无数据或是要获取明日数据，则发送请求获取数据
  if (!sunDataRaw || afterSunset) {
    let tomorrowDate = new Date()
    tomorrowDate.setDate(currentDate.getDate() + 1)
    const dateToUse = afterSunset ? tomorrowDate : currentDate
    const sunReq = "https://api.caiyunapp.com/v2.5/" + apiKey + "/" + locationData.longitude + "," + locationData.latitude +"/weather.json?lang=" + lang + "&unit=" + weatherSettings.units + "&dailystart=0&hourlysteps=384&dailysteps=16"
    sunDataRaw = await new Request(sunReq).loadJSON()
    files.writeString(sunCachePath, JSON.stringify(sunDataRaw))
  }
  // 存储数据
  sunData = {}
  var nowDate = new Date()
  year = nowDate.getFullYear()
  month = nowDate.getMonth() + 1
  if (month < 10) month = "0" + month
  date = nowDate.getDate();
  if (date < 10) date = "0" + date
  sunData.sunrise = new Date(year + "-" + month + "-" + date + "T" + weather.daily.astro[0].sunrise.time + ":00+00:00").getTime()
  sunData.sunset = new Date(year + "-" + month + "-" + date + "T" + weather.daily.astro[0].sunset.time + ":00+00:00").getTime()
}

/*
小组件显示函数集
*/
// 定位信息
async function currentLocation(column) {
  if (!locationData) { await setupLocation() }
  let currentLocationStack = column.addStack()
  currentLocationStack.layoutVertically()
  currentLocationStack.setPadding(padding, padding, 0, 0)
  currentLocationStack.url = ""
  // 判断是否显示定位
  if (weatherSettings.showLocation) {
    let locationTextStack = align(currentLocationStack)
    let locationText = provideText(locationData.address, locationTextStack, textFormat.location)
    locationTextStack.setPadding(0, 0, 0, 0)
  }
}
// 更新时间
async function severTime(column) {
  if (!weatherData) { await setupWeather() }
  let severTimeStack = column.addStack()
  severTimeStack.layoutVertically()
  severTimeStack.setPadding(padding, padding, 0, 0)
  severTimeStack.url = ""
  // 获取时间
  var updateTime = new Date(weatherData.serverTime)
  Y = updateTime.getFullYear() + '-'
  M = (updateTime.getMonth()+1 < 10 ? '0'+(updateTime.getMonth()+1) : updateTime.getMonth()+1) + '-'
  D = updateTime.getDate()
  h = updateTime.getHours() < 10 ? '0' + updateTime.getHours() : updateTime.getHours()
  m = updateTime.getMinutes() < 10 ? '0' + updateTime.getMinutes() : updateTime.getMinutes()
  s = updateTime.getSeconds()
  // 判断是否显示更新时间
  if (weatherSettings.showUpdatetime) {
    let timeTextStack = align(severTimeStack)
    let locationText = provideText("更新: " + h + ":" + m, timeTextStack, textFormat.location)
    timeTextStack.setPadding(0, 0, 0, padding)
  }
}
// 当前天气
async function current(column) {
  if (!weatherData) { await setupWeather() }
  if (!sunData) { await setupSunrise() }
  let currentWeatherStack = column.addStack()
  currentWeatherStack.layoutVertically()
  currentWeatherStack.setPadding(0, padding, 0, 0)
  currentWeatherStack.url = ""
 
  // 实时天气stack
  let realtimeStack = currentWeatherStack.addStack()
  realtimeStack.layoutHorizontally()
  realtimeStack.centerAlignContent()
  realtimeStack.setPadding(weatherSettings.showLocation ? 0 : 0, 0, 0, 0)
  
  // 温度+高低温
  const tempStack = realtimeStack.addStack()
  tempStack.layoutVertically()
//   tempStack.centerAlignContent()
  tempStack.setPadding(0, 0, 0, 0)
  // 实时温度
  const currentTempStack = tempStack.addStack()
  currentTempStack.setPadding(0, 0, 0, 0)
  const tempText = Math.round(weatherData.currentTemp) + "°"
  const temp = provideText(tempText, currentTempStack, textFormat.currentTemp)
  // 当日最高最低气温
  if (weatherSettings.showHighLow) {
    let tempBarStack = tempStack.addStack()
    tempBarStack.layoutVertically()
    tempBarStack.setPadding(0, 0, 0, 0)

    let tempBar = drawTempBar()
    let tempBarImage = tempBarStack.addImage(tempBar)
    tempBarImage.size = new Size(50,0)

    tempBarStack.addSpacer(1)

    let highLowStack = tempBarStack.addStack()
    highLowStack.layoutHorizontally()
    const mainLowText = Math.round(weatherData.todayLow).toString()
    const mainLow = provideText(mainLowText, highLowStack, textFormat.tinyTemp)

    highLowStack.addSpacer()

    const mainHighText = Math.round(weatherData.todayHigh).toString()
    const mainHigh = provideText(mainHighText, highLowStack, textFormat.tinyTemp)
    tempBarStack.size = new Size(50,30)
  }

  // 天气图标+改款
  let mainConditionStack = realtimeStack.addStack()
  mainConditionStack.layoutVertically()
  mainConditionStack.centerAlignContent()
  mainConditionStack.setPadding(0, 0, 0, 0)
  
  mainConditionStack.addSpacer()
  
  // 图标
  let mainIconStack = mainConditionStack.addStack()
  mainIconStack.setPadding(0, padding, 0, 0)
  let mainIcon = mainIconStack.addImage(SFSymbol.named((mapSkycon(weather.realtime.skycon)[1])).image)
  mainIcon.imageSize = new Size(iconSize.large,iconSize.large)
  
  mainConditionStack.addSpacer()
  
  // 概况
  if (weatherSettings.showCondition) {
   let mainTextStack = mainConditionStack.addStack()
   let mainText = provideText(mapSkycon(weather.realtime.skycon)[0], mainTextStack, textFormat.keyword)
   mainTextStack.setPadding(0, padding, 0, 0)
  }
  
  mainConditionStack.addSpacer()  
}

// 未来天气
async function future(column) {
  if (!weatherData) { await setupWeather() }
  if (!sunData) { await setupSunrise() }
  let futureWeatherStack = column.addStack()
  futureWeatherStack.layoutVertically()
  futureWeatherStack.setPadding(0, 0, 0, 0)
  futureWeatherStack.url = ""
  // 判断是否需要显示未来天气
  const showNextHour = (currentDate.getHours() < weatherSettings.tomorrowShownAtHour)
  // 设置标签
  const subLabelStack = align(futureWeatherStack)
  const subLabelText = showNextHour ? localizedText.nextHourLabel : localizedText.tomorrowLabel
  const subLabel = provideText(subLabelText, subLabelStack, textFormat.label)
  subLabelStack.setPadding(0, 0, padding/2, padding)
  let subConditionStack = align(futureWeatherStack)
  subConditionStack.layoutHorizontally()
  subConditionStack.centerAlignContent()
  subConditionStack.setPadding(0, padding, 0, padding)
  let subCondition = subConditionStack.addImage(showNextHour ? SFSymbol.named(weatherData.nextHourSkycon).image : SFSymbol.named(weatherData.tomorrowSkycon).image)
  const subConditionSize = showNextHour ? iconSize.small : iconSize.small
  subCondition.imageSize = new Size(subConditionSize, subConditionSize)
  subConditionStack.addSpacer(5)
  //  根据判断显示对应内容
  if (showNextHour) {
    const subTempText = Math.round(weatherData.nextHourTemp) + "°"
    const subTemp = provideText(subTempText, subConditionStack, textFormat.smallTemp)
  } else {
    let tomorrowLine = subConditionStack.addImage(drawVerticalLine(new Color("ffffff", 0.5), 20))
    tomorrowLine.imageSize = new Size(3,28)
    subConditionStack.addSpacer(5)
    let tomorrowStack = subConditionStack.addStack()
    tomorrowStack.layoutVertically()
    const tomorrowHighText = Math.round(weatherData.tomorrowHigh) + ""
    const tomorrowHigh = provideText(tomorrowHighText, tomorrowStack, textFormat.tinyTemp)
    tomorrowStack.addSpacer(4)
    const tomorrowLowText = Math.round(weatherData.tomorrowLow) + ""
    const tomorrowLow = provideText(tomorrowLowText, tomorrowStack, textFormat.tinyTemp)
  }
}

// 当前天气详细信息
async function currentInfo(column) {
  if (!weatherData) { await setupWeather() }
  let currentInfoStack = column.addStack()
  currentInfoStack.layoutHorizontally()
  currentInfoStack.setPadding(0, padding, padding, padding)
  currentInfoStack.url = ""

  // 列1
  let infoStack1 = currentInfoStack.addStack()
  infoStack1.layoutVertically()
  infoStack1.setPadding(0, 0, 0, padding/2)
  infoStack1.size = new Size(68,0)
  // 体感温度
  provideText(localizedText.apparent, infoStack1, textFormat.infoLabel)
  provideText(Math.round(weatherData.currentAppTemp) + "°", infoStack1, textFormat.infoNum)
  // 相对湿度
  provideText(localizedText.humidity, infoStack1, textFormat.infoLabel)
  provideText(Math.round(weatherData.currentHumidity) + "%", infoStack1, textFormat.infoNum)
  
  // 列2
  let infoStack2 = currentInfoStack.addStack()
  infoStack2.layoutVertically()
  infoStack2.setPadding(0, 0, 0, padding/2)
  infoStack2.size = new Size(68,0)
  // 风力
  provideText(localizedText.windSpeed, infoStack2, textFormat.infoLabel)
  provideText(weatherData.currentWindSpeed, infoStack2, textFormat.infoNum)
  // 风力
  provideText(localizedText.windDirection, infoStack2, textFormat.infoLabel)
  provideText(weatherData.currentWindDir, infoStack2, textFormat.infoNum)
  
  // 列3
  let infoStack3 = currentInfoStack.addStack()
  infoStack3.layoutVertically()
  infoStack3.setPadding(0, 0, 0, padding)
  infoStack3.size = new Size(75,0)
  // 紫外线强度
  provideText(localizedText.UV, infoStack3, textFormat.infoLabel)
  provideText(weatherData.currentUV, infoStack3, textFormat.infoNum)
  // 空气质量
  provideText(localizedText.AQ, infoStack3, textFormat.infoLabel)
  provideText(weatherData.currentAQ, infoStack3, textFormat.infoNum)
}
 
// 自然语义天气
async function keyPoint(column) {
  if (!weatherData) { await setupWeather() }
  let keyPointStack = column.addStack()
  keyPointStack.layoutHorizontally()
  keyPointStack.setPadding(0, padding, 0, padding)
  keyPointStack.url = ""
  if (weatherSettings.showKeypoint) {
    provideText(weatherData.keypoint, keyPointStack, textFormat.keypoint)
  }
}



/*
功能函数集
*/
// 转换风力信息
function mapWind(speed, direction) {
  let description = "";
  let d_description = "";
  // 风力
  if (speed < 1) {
    description = `0${localizedText.kyu}`;
    return description;
  } else if (speed <= 5) {
    description = `1${localizedText.kyu}`;
  } else if (speed <= 11) {
    description = `2${localizedText.kyu}`;
  } else if (speed <= 19) {
    description = `3${localizedText.kyu}`;
  } else if (speed <= 28) {
    description = `4${localizedText.kyu}`;
  } else if (speed <= 38) {
    description = `5${localizedText.kyu}`;
  } else if (speed <= 49) {
    description = `6${localizedText.kyu}`;
  } else if (speed <= 61) {
    description = `7${localizedText.kyu}`;
  } else if (speed <= 74) {
    description = `8${localizedText.kyu}`;
  } else if (speed <= 88) {
    description = `9${localizedText.kyu}`;
  } else if (speed <= 102) {
    description = `10${localizedText.kyu}`;
  } else if (speed <= 117) {
    description = `11${localizedText.kyu}`;
  } else if (speed <= 133) {
    description = `12${localizedText.kyu}`;
  } else if (speed <= 149) {
    description = `13${localizedText.kyu}`;
  } else if (speed <= 166) {
    description = `14${localizedText.kyu}`;
  } else if (speed <= 183) {
    description = `15${localizedText.kyu}`;
  } else if (speed <= 201) {
    description = `16${localizedText.kyu}`;
  } else if (speed <= 220) {
    description = `17${localizedText.kyu}`;
  }
  // 风向
  if (direction >= 348.76 || direction <= 11.25) {
    d_description = localizedText.n;
  } else if (direction >= 11.26 && direction <= 33.75) {
    d_description = localizedText.nen;
  } else if (direction >= 33.76 && direction <= 56.25) {
    d_description = localizedText.ne;
  } else if (direction >= 56.26 && direction <= 78.75) {
    d_description = localizedText.nee;
  } else if (direction >= 78.76 && direction <= 101.25) {
    d_description = localizedText.e;
  } else if (direction >= 101.26 && direction <= 123.75) {
    d_description = localizedText.see;
  } else if (direction >= 123.76 && direction <= 146.25) {
    d_description = localizedText.se;
  } else if (direction >= 146.26 && direction <= 168.75) {
    d_description = localizedText.ses;
  } else if (direction >= 168.76 && direction <= 191.25) {
    d_description = localizedText.s;
  } else if (direction >= 191.26 && direction <= 213.75) {
    d_description = localizedText.sws;
  } else if (direction >= 213.76 && direction <= 236.25) {
    d_description = localizedText.sw;
  } else if (direction >= 236.26 && direction <= 258.75) {
    d_description = localizedText.sww;
  } else if (direction >= 258.76 && direction <= 281.25) {
    d_description = localizedText.w;
  } else if (direction >= 281.26 && direction <= 303.75) {
    d_description = localizedText.nww;
  } else if (direction >= 303.76 && direction <= 326.25) {
    d_description = localizedText.nw;
  } else if (direction >= 326.26 && direction <= 348.75) {
    d_description = localizedText.nwn;
  }
  return {
    windDirection: d_description
    ,windSpeed: description
  }
}

// 天气状况 --> 自然语言描述
function mapSkycon(skycon) {
  const map = {
    CLEAR_DAY: [
      localizedText.clear,
      "sun.max.fill",
      "https://raw.githubusercontent.com/58xinian/icon/master/Weather/CLEAR_DAY.gif",
    ],
    CLEAR_NIGHT: [
      localizedText.clear,
      "moon.stars.fill",
      "https://raw.githubusercontent.com/58xinian/icon/master/Weather/CLEAR_NIGHT.gif",
    ],
    PARTLY_CLOUDY_DAY: [
      localizedText.partlyCloudy,
      "cloud.sun.fill",
      "https://raw.githubusercontent.com/58xinian/icon/master/Weather/PARTLY_CLOUDY_DAY.gif",
    ],
    PARTLY_CLOUDY_NIGHT: [
      localizedText.partlyCloudy,
      "cloud.moon.fill",
      "https://raw.githubusercontent.com/58xinian/icon/master/Weather/PARTLY_CLOUDY_NIGHT.gif",
    ],
    CLOUDY: [
      localizedText.cloudy,
      "cloud.fill",
      "https://raw.githubusercontent.com/58xinian/icon/master/Weather/CLOUDY.gif",
    ],
    LIGHT_HAZE: [
      localizedText.lightHaze,
      "smoke.fill",
      "https://raw.githubusercontent.com/58xinian/icon/master/Weather/HAZE.gif",
    ],
    MODERATE_HAZE: [
      localizedText.moderateHaze,
      "smoke.fill",
      "https://raw.githubusercontent.com/58xinian/icon/master/Weather/HAZE.gif",
    ],
    HEAVY_HAZE: [
      localizedText.heavyHaze,
      "smoke.fill",
      "https://raw.githubusercontent.com/58xinian/icon/master/Weather/HAZE.gif",
    ],
    LIGHT_RAIN: [
      localizedText.lightRain,
      "cloud.drizzle.fill",
      "https://raw.githubusercontent.com/58xinian/icon/master/Weather/LIGHT.gif",
    ],
    MODERATE_RAIN: [
      localizedText.moderateRain,
      "cloud.rain.fill",
      "https://raw.githubusercontent.com/58xinian/icon/master/Weather/MODERATE_RAIN.gif",
    ],
    HEAVY_RAIN: [
      localizedText.heavyRain,
      "cloud.heavyrain.fill",
      "https://raw.githubusercontent.com/58xinian/icon/master/Weather/STORM_RAIN.gif",
    ],
    STORM_RAIN: [
      localizedText.stormRain,
      "cloud.heavyrain.fill",
      "https://raw.githubusercontent.com/58xinian/icon/master/Weather/STORM_RAIN.gif",
    ],
    LIGHT_SNOW: [
      localizedText.lightSnow,
      "cloud.snow.fill",
      "https://raw.githubusercontent.com/58xinian/icon/master/Weather/LIGHT_SNOW.gif",
    ],
    MODERATE_SNOW: [
      localizedText.moderateSnow,
      "cloud.snow.fill",
      "https://raw.githubusercontent.com/58xinian/icon/master/Weather/MODERATE_SNOW.gif",
    ],
    HEAVY_SNOW: [
      localizedText.heavySnow,
      "snow",
      "https://raw.githubusercontent.com/58xinian/icon/master/Weather/HEAVY_SNOW.gif",
    ],
    STORM_SNOW: [
      localizedText.stormSnow,
      "snow",
      "https://raw.githubusercontent.com/58xinian/icon/master/Weather/HEAVY_SNOW",
    ],
    DUST: [localizedText.dust,"smoke.fill",],
    SAND: [localizedText.sand,"smoke.fill",],
    WIND: [localizedText.wind,"wind",],
  };
  return map[skycon];
}

// 判断是否为夜晚
function isNight(dateInput) {
  const timeValue = dateInput.getTime()
  return (timeValue < sunData.sunrise) || (timeValue > sunData.sunset)
}

// 判断是否为同一天
function sameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
}

// 返回两个给定时间与现在之间的分钟值
function closeTo(time) {
  return Math.abs(currentDate.getTime() - time) / 60000
}

// 字体设置
function provideFont(fontName, fontSize) {
  const fontGenerator = {
    "ultralight": function() { return Font.ultraLightSystemFont(fontSize) },
    "light": function() { return Font.lightSystemFont(fontSize) },
    "regular": function() { return Font.regularSystemFont(fontSize) },
    "medium": function() { return Font.mediumSystemFont(fontSize) },
    "semibold": function() { return Font.semiboldSystemFont(fontSize) },
    "bold": function() { return Font.boldSystemFont(fontSize) },
    "heavy": function() { return Font.heavySystemFont(fontSize) },
    "black": function() { return Font.blackSystemFont(fontSize) },
    "italic": function() { return Font.italicSystemFont(fontSize) }
  }
  const systemFont = fontGenerator[fontName]
  if (systemFont) { return systemFont() }
  return new Font(fontName, fontSize)
}

// 为指定容器添加对应格式文本
function provideText(string, container, format) {
  const textItem = container.addText(string)
  const textFont = format.font || textFormat.defaultText.font
  const textSize = format.size || textFormat.defaultText.size
  const textColor = format.color || textFormat.defaultText.color
  textItem.font = provideFont(textFont, textSize)
  textItem.textColor = new Color(textColor)
  return textItem
}

/*
绘制函数
*/
// 绘制竖直线
function drawVerticalLine(color, height) {
  const width = 2
  let draw = new DrawContext()
  draw.opaque = false
  draw.respectScreenScale = true
  draw.size = new Size(width,height)
  let barPath = new Path()
  const barHeight = height
  barPath.addRoundedRect(new Rect(0, 0, width, height), width/2, width/2)
  draw.addPath(barPath)
  draw.setFillColor(color)
  draw.fillPath()
  return draw.getImage()
}

// 绘制温度条
function drawTempBar() {
  const tempBarWidth = 200
  const tempBarHeight = 20
  // 计算当前百分比
  let percent = (weatherData.currentTemp - weatherData.todayLow) / (weatherData.todayHigh - weatherData.todayLow)
  // 超出范围则自动剪切
  if (percent < 0) {
    percent = 0
  } else if (percent > 1) {
    percent = 1
  }
  // 确定当前温度对应的位置
  const currPosition = (tempBarWidth - tempBarHeight) * percent
  // 开始绘制
  let draw = new DrawContext()
  draw.opaque = false
  draw.respectScreenScale = true
  draw.size = new Size(tempBarWidth, tempBarHeight)
  // Make the path for the bar.
  let barPath = new Path()
  const barHeight = tempBarHeight - 10
  barPath.addRoundedRect(new Rect(0, 5, tempBarWidth, barHeight), barHeight / 2, barHeight / 2)
  draw.addPath(barPath)
  draw.setFillColor(new Color("ffffff", 0.5))
  draw.fillPath()
  // Make the path for the current temp indicator.
  let currPath = new Path()
  currPath.addEllipse(new Rect(currPosition, 0, tempBarHeight, tempBarHeight))
  draw.addPath(currPath)
  draw.setFillColor(new Color("ffffff", 1))
  draw.fillPath()
  return draw.getImage()
}

/*
透明背景
*/
async function generateBackground() {
  const okTips = "小部件背景已准备就绪"
  let message = "图片模式支持相册照片或背景透明"
  let options = ["图片选择","透明背景"]
  let isTransparentMode = await generateAlert(message, options)
  if (!isTransparentMode) {
    let img = await Photos.fromLibrary()
    message = okTips
    const resultOptions = ["好的"]
    await generateAlert(message, resultOptions)
    return img
  } else {
    message = "以下是【透明背景】生成步骤，如果你没有屏幕截图请退出，并返回主屏幕长按进入编辑模式。滑动到最右边的空白页截图。然后重新运行！"
    let exitOptions = ["继续(已有截图)","退出(没有截图)"]
    let shouldExit = await generateAlert(message,exitOptions)
    if (shouldExit) return
    
    let imgOrigin = await Photos.fromLibrary()
    let height = imgOrigin.size.height
    let phone = phoneSizes()[height]
    if (!phone) {
      message = "似乎选择了非iPhone屏幕截图的图像，或者不支持你的iPhone。请使用其他图像再试一次!"
      await generateAlert(message,["好的！现在去截图"])
      return
    }
  
    // 确定尺寸
    message = "想要创建什么尺寸的小部件？"
    let sizes = ["小号","中号","大号"]
    let size = await generateAlert(message,sizes)
    let widgetSize = sizes[size]
  
    message = "想在什么位置放置小组件？"
    message += (height == 1136 ? " (请注意，您的设备仅支持两行小部件，因此中间和底部选项相同。)" : "")
  
    // 裁剪尺寸
    let crop = { w: "", h: "", x: "", y: "" }
    if (widgetSize == "小号") {
      crop.w = phone.小号
      crop.h = phone.小号
      let positions = ["顶部 左边","顶部 右边","中间 左边","中间 右边","底部 左边","底部 右边"]
      let position = await generateAlert(message,positions)
    
      let keys = positions[position].split(' ')
      crop.y = phone[keys[0]]
      crop.x = phone[keys[1]]
    
    } else if (widgetSize == "中号") {
      crop.w = phone.中号
      crop.h = phone.小号

      crop.x = phone.左边
      let positions = ["顶部","中间","底部"]
      let position = await generateAlert(message,positions)
      let key = positions[position].toLowerCase()
      crop.y = phone[key]
    
    } else if(widgetSize == "大号") {
      crop.w = phone.中号
      crop.h = phone.大号
      crop.x = phone.左边
      let positions = ["顶部","底部"]
      let position = await generateAlert(message,positions)
    
      crop.y = position ? phone.中间 : phone.顶部
    }
    
    // 裁剪图片
    let img = cropImage(imgOrigin, new Rect(crop.x,crop.y,crop.w,crop.h))
    
    message = "小部件背景已准备就绪。"
    const resultOptions = ["好的"]
    await generateAlert(message, resultOptions)
    return img
  }
}

// 弹出对话框
async function generateAlert(message,options) {
  let alert = new Alert()
  alert.message = message
  
  for (const option of options) {
    alert.addAction(option)
  }
  
  let response = await alert.presentAlert()
  return response
}

// 裁剪图片
function cropImage(img,rect) {
  let draw = new DrawContext()
  draw.size = new Size(rect.width, rect.height)
  draw.drawImageAtPoint(img,new Point(-rect.x, -rect.y))  
  return draw.getImage()
}

// 识别iPhone尺寸
function phoneSizes() {
  let phones = {  
  "2688": {
      "小号":  507,
      "中号":  1080,
      "大号":  1137,
      "左边":  81,
      "右边":  654,
      "顶部":  228,
      "中间":  858,
      "底部":  1488
  },
  
  "1792": {
      "小号":  338,
      "中号":  720,
      "大号":  758,
      "左边":  54,
      "右边":  436,
      "顶部":  160,
      "中间":  580,
      "底部":  1000
  },
  
  "2436": {
      "小号":  465,
      "中号":  987,
      "大号":  1035,
      "左边":  69,
      "右边":  591,
      "顶部":  213,
      "中间":  783,
      "底部":  1353
  },
  
  "2208": {
      "小号":  471,
      "中号":  1044,
      "大号":  1071,
      "左边":  99,
      "右边":  672,
      "顶部":  114,
      "中间":  696,
      "底部":  1278
  },
  
  "1334": {
      "小号":  296,
      "中号":  642,
      "大号":  648,
      "左边":  54,
      "右边":  400,
      "顶部":  60,
      "中间":  412,
      "底部":  764
  },
  
  "1136": {
      "小号":  282,
      "中号":  584,
      "大号":  622,
      "左边":  30,
      "右边":  332,
      "顶部":  59,
      "中间":  399,
      "底部":  399
  }
  }
  return phones
}
