/*
 * 自定义设置
 * 用于小组件参数设置
 * ======================================
 */

// 彩云API
const apiKey = ""
// 单一定位true，自动定位false
const lockLocation = false
// 单位：摄氏metric，华氏imperial
const units = "metric"
// 小组件预览尺寸
const widgetPreview = "large"
// 是否使用背景图片
const imageBackground = true
// 重建背景图片缓存
const forceImageUpdate = false
// 彩云天气语言
const lang = "ja"
if (lang == "ja")
// 自定义文本
 {var localizedText = {
  // 欢迎语
  nightGreeting: "おやすみなさい"
  ,morningGreeting: "おはようございます"
  ,afternoonGreeting: "こんにちは"
  ,eveningGreeting: "こんばんは"
  // 未来天气标题
  ,nextHourLabel: "次の１時間"
  ,tomorrowLabel: "明日"
  // 无事件时显示，可留空
  ,noEventMessage: "今日はもう予定はありません"
}}
else if(lang == "zh_CN")
// 自定义文本
{var localizedText = {
  // 欢迎语
  nightGreeting: "晚安"
  ,morningGreeting: "早上好"
  ,afternoonGreeting: "下午好"
  ,eveningGreeting: "晚上好"
  // 未来天气标题
  ,nextHourLabel: "下一小时"
  ,tomorrowLabel: "明天"
  // 无事件时显示，可留空
  ,noEventMessage: "今天已经没有行程安排"
}}

/*
 * 界面配置
 * 设置小组件各元素
 * ===========================================
 */
// Set the width of the column, or set to 0 for an automatic width.
// You can add items to the column: 
// date, greeting, events, current, future, text("Your text here")
// You can also add a left, center, or right to the list. Everything after it will be aligned that way.
// Make sure to always put a comma after each item.
const columns = [{
  // Settings for the left column.
  width: 0,
  items: [
    left,
//     greeting,
    weatherKeypoint,
    date,
    events,
end]}, {
  // Settings for the right column.
  width: 100,
  items: [
    left,
    current,
    space,
    future,
end]}]
/*
 * 格式
 * 设置各元素格式
 * =====================================
 */  

// 日历
// ======
// 显示的事件格式
const numberOfEvents = 3
// 是否显示全天事件
const showAllDay = true
// 是否显示明日事件
const showTomorrow = true
// 事件长度：不显示""，时长"duration"，时间"time"
const showEventLength = "duration"

// 天气
// =======
// 是否显示当日最高温和最低温
const showHighLow = true
// 设置几点开始显示明日天气（24小时制）
const tomorrowShownAtHour = 23

// 日期
// ====
// 是否有显示事件时减小日期显示大小
const dynamicDateSize = true
// 上一项为false时日期显示的大小
const staticDateSize = "large"
// 日期格式，详见docs.scriptable.app/dateformatter
const smallDateFormat = "EEEE MMMMd日"
const largeDateLineOne = "EEEE"
const largeDateLineTwo = "MMMMd日"

// 字体设置：详见iosfonts.com，若使用iOS默认字体，将font name设置为: ultralight, light, regular, medium, semibold, bold, heavy, black, or italic.
const textFormat = {
  // 默认
  defaultText: { size: 14, color: "ffffff", font: "regular" },
  // 留空的参数将使用默认设置中的参数
  smallDate:   { size: 17, color: "", font: "semibold" },
  largeDate1:  { size: 30, color: "", font: "light" },
  largeDate2:  { size: 30, color: "", font: "light" },
  greeting:    { size: 18, color: "", font: "semibold" },
  eventTitle:  { size: 14, color: "", font: "semibold" },
  eventTime:   { size: 14, color: "ffffffcc", font: "" },
  largeTemp:   { size: 28, color: "", font: "light" },
  mediumTemp:   { size: 15, color: "", font: "" },
  smallTemp:   { size: 14, color: "", font: "" },
  tinyTemp:    { size: 12, color: "", font: "" },
  tinyName:    { size: 9, color: "", font: "" },
  mediumName:   { size: 14, color: "", font: "" },
  customText:  { size: 14, color: "", font: "" } 
}

/*
 * 小组件代码
 * 
 * =====================================
 */

// 日期与事件设置
const currentDate = new Date()
const todayEvents = await CalendarEvent.today([])
const tomorrowEvents = await CalendarEvent.tomorrow([])
const futureEvents = enumerateEvents()
const eventsAreVisible = (futureEvents.length > 0) && (numberOfEvents > 0)
// 设置文件存储位置
const files = FileManager.iCloud()
// 建立地理位置缓存
const locationPath = files.joinPath(files.documentsDirectory() + "/Widget", "weather-cal-location")
var latitude, longitude
// 若为显示单一位置，则尝试从缓存文件里读取
if (lockLocation && files.fileExists(locationPath)) {
  const locationStr = files.readString(locationPath).split(",")
  latitude = locationStr[0]
  longitude = locationStr[1]
// 否则调用系统定位写入缓存
} else {
  const location = await Location.current()
  while (!location)
  {log("locating")}
  latitude = location.latitude
  longitude = location.longitude
  files.writeString(locationPath, latitude + "," + longitude)
}
// 建立天气缓存
const cachePath = files.joinPath(files.documentsDirectory() + "/Widget", "weather-cal-cache")
const cacheExists = files.fileExists(cachePath)
const cacheDate = cacheExists ? files.modificationDate(cachePath) : 0
var data
// 若缓存文件已存在且文件修更新时间小于60s，调用缓存文件
if (cacheExists && (currentDate.getTime() - cacheDate.getTime()) < 60000) {
  const cache = files.readString(cachePath)
  data = JSON.parse(cache)
// 否则调用API重新获取天气数据
} else {
  const weatherReq = "https://api.caiyunapp.com/v2.5/" + apiKey + "/" + longitude + "," + latitude +"/weather.json?lang=" + lang + "&dailystart=0&hourlysteps=384&dailysteps=16&alert=true"
  data = await new Request(weatherReq).loadJSON()
  files.writeString(cachePath, JSON.stringify(data))
}
// 储存天气数据
const weather = data.result
const keypoint = weather.forecast_keypoint
const currentTemp = weather.realtime.temperature
const currentAppTemp = weather.realtime.apparent_temperature
const currentHumidity = (weather.realtime.humidity * 100).toFixed(0)
const currentAQ = weather.realtime.air_quality.description.chn
const currentUV = weather.realtime.life_index.ultraviolet.desc
const currentWindSpeed = weather.realtime.wind.speed
const currentWindDir = weather.realtime.wind.direction
const currentSkycon = mapSkycon(weather.
realtime.skycon)[0]
const currentWind = mapWind(weather.realtime.wind.speed,weather.realtime.wind.direction)
const currentCondition = 200
const todayHigh = (weather.daily.temperature[0].max).toFixed(0)
const todayLow = (weather.daily.temperature[0].min).toFixed(0)
const nextHourTemp = (weather.hourly.temperature[1].value).toFixed(0)
const nextHourCondition = 300
const tomorrowHigh = (weather.daily.temperature[1].max).toFixed(0)
const tomorrowLow = (weather.daily.temperature[1].min).toFixed(0)
const tomorrowCondition = 400
// Set up the sunrise/sunset cache.
var nowDate = new Date()
year = nowDate.getFullYear()
month = nowDate.getMonth() + 1
if (month < 10) month = "0" + month
date = nowDate.getDate();
if (date < 10) date = "0" + date
const sunrise = new Date(year + "-" + month + "-" + date + "T" + weather.daily.astro[0].sunrise.time + ":00+00:00").getTime()
const sunset = new Date(year + "-" + month + "-" + date + "T" + weather.daily.astro[0].sunset.time + ":00+00:00").getTime()
const utcTime = currentDate.getTime()
/*
 * COLUMNS AND PADDING
 * ===================
 */

// Set up the widget and the main stack.
let widget = new ListWidget()
widget.setPadding(0, 0, 0, 0)

let mainStack = widget.addStack()
mainStack.layoutHorizontally()
mainStack.setPadding(0, 0, 0, 0)

// Set up alignment
var currentAlignment = left

// Set up our columns.
for (var x = 0; x < columns.length; x++) {

  let column = columns[x]
  let columnStack = mainStack.addStack()
  columnStack.layoutVertically()
  
  // Only add padding on the first or last column.
  columnStack.setPadding(0, x == 0 ? 5 : 0, 0, x == columns.length-1 ? 5 : 0)
  columnStack.size = new Size(column.width,0)
  
  // Add the items to the column.
  for (var i = 0; i < column.items.length; i++) {
    column.items[i](columnStack)
  }
}

/*
 * BACKGROUND DISPLAY
 * ==================
 */

// If it's an image background, display it.
if (imageBackground) {
  
  // Determine if our image exists and when it was saved.
  const path = files.joinPath(files.documentsDirectory() + "/Widget", "weather-cal-image")
  const exists = files.fileExists(path)
  const createdToday = exists ? sameDay(files.modificationDate(path),currentDate) : false
  
  // If it exists and updates aren't being forced, use the cache.
  if (exists && !forceImageUpdate) { 
    widget.backgroundImage = files.readImage(path)
  
  // If it's missing or forced to update...
  } else if (!exists || forceImageUpdate) { 
    
    // ... just use a gray background if we're in the widget.
    if (config.runsInWidget) { 
      widget.backgroundColor = Color.gray() 
    
    // But if we're running in app, prompt the user for the image.
    } else {
      const img = await Photos.fromLibrary()
      widget.backgroundImage = img
      files.writeImage(path, img)
    }
  }
    
// If it's not an image background, show the gradient.
} else {
  let gradient = new LinearGradient()
  let gradientSettings = getGradientSettings()
  
  gradient.colors = gradientSettings.color()
  gradient.locations = gradientSettings.position()
  
  widget.backgroundGradient = gradient
}

Script.setWidget(widget)
if (widgetPreview == "small") { widget.presentSmall() }
else if (widgetPreview == "medium") { widget.presentMedium() }
else if (widgetPreview == "large") { widget.presentLarge() }
Script.complete()

/*
 * IMAGES AND FORMATTING
 * =====================
 */

// Get the gradient settings for each time of day.
function getGradientSettings() {

  let gradient = {
		"dawn": {
			"color": function() { return [new Color("142C52"), new Color("1B416F"), new Color("62668B")] },
			"position": function() { return [0, 0.5, 1] }
		},
	
		"sunrise": {
			"color": function() { return [new Color("274875"), new Color("766f8d"), new Color("f0b35e")] },
			"position": function() { return [0, 0.8, 1.5] }
		},
	
		"midday": {
			"color": function() { return [new Color("3a8cc1"), new Color("90c0df")] },
			"position": function() { return [0, 1] }
		},
	
		"noon": {
			"color": function() { return [new Color("b2d0e1"), new Color("80B5DB"), new Color("3a8cc1")] },
			"position": function() { return [-0.2, 0.2, 1.5] }
		},
	
		"sunset": {
			"color": function() { return [new Color("32327A"), new Color("662E55"), new Color("7C2F43")] },
			"position": function() { return [0.1, 0.9, 1.2] }
		},
	
		"twilight": {
			"color": function() { return [new Color("021033"), new Color("16296b"), new Color("414791")] },
			"position": function() { return [0, 0.5, 1] }
		},
	
		"night": {
			"color": function() { return [new Color("16296b"), new Color("021033"), new Color("021033"), new Color("113245")] },
			"position": function() { return [-0.5, 0.2, 0.5, 1] }
		}
	}

  function closeTo(time,mins) {
    return Math.abs(utcTime - time) < (mins * 60000)
  }

  // Use sunrise or sunset if we're within 30min of it.
	if (closeTo(sunrise,15)) { return gradient.sunrise }
	if (closeTo(sunset,15)) { return gradient.sunset }

	// In the 30min before/after, use dawn/twilight.
	if (closeTo(sunrise,45) && utcTime < sunrise) { return gradient.dawn }
	if (closeTo(sunset,45) && utcTime > sunset) { return gradient.twilight }

    // Otherwise, if it's night, return night.
	if (isNight(currentDate)) { return gradient.night }

	// If it's around noon, the sun is high in the sky.
	if (currentDate.getHours() == 12) { return gradient.noon }

	// Otherwise, return the "typical" theme.
	return gradient.midday
}

// Provide a symbol based on the condition.
function provideSymbol(cond,night) {
  
  // Define our symbol equivalencies.
  let symbols = {
  
    // Thunderstorm
    "2": function() { return "cloud.bolt.rain.fill" },
    
    // Drizzle
    "3": function() { return "cloud.drizzle.fill" },
    
    // Rain
    "5": function() { return (cond == 511) ? "cloud.sleet.fill" : "cloud.rain.fill" },
    
    // Snow
    "6": function() { return (cond >= 611 && cond <= 613) ? "cloud.snow.fill" : "snow" },
    
    // Atmosphere
    "7": function() {
      if (cond == 781) { return "tornado" }
      if (cond == 701 || cond == 741) { return "cloud.fog.fill" }
      return night ? "cloud.fog.fill" : "sun.haze.fill"
    },
    
    // Clear and clouds
    "8": function() {
      if (cond == 800 || cond == 801) { return night ? "moon.stars.fill" : "sun.max.fill" }
      if (cond == 802 || cond == 803) { return
       night ? "cloud.moon.fill" : "cloud.sun.fill" }
      return "cloud.fill"
    }
  }
  
  // Find out the first digit.
  let conditionDigit = Math.floor(cond / 100)
  
  // Get the symbol.
  return SFSymbol.named(symbols[conditionDigit]()).image
}

// Provide a font based on the input.
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
 
// Format text based on the settings.
function formatText(textItem, format) {
  const textFont = format.font || textFormat.defaultText.font
  const textSize = format.size || textFormat.defaultText.size
  const textColor = format.color || textFormat.defaultText.color
  
  textItem.font = provideFont(textFont, textSize)
  textItem.textColor = new Color(textColor)
}

/*
 * HELPER FUNCTIONS
 * ================
 */

// Find future events that aren't all day and aren't canceled
function enumerateEvents() {

  // Function to determine if an event should be shown.
  function shouldShowEvent(event) {

    // Hack to remove canceled Office 365 events.
    if (event.title.startsWith("Canceled:")) { return false }

    // If it's an all-day event, only show if the setting is active.
    if (event.isAllDay) { return showAllDay }

    // Otherwise, return the event if it's in the future.
    return (event.startDate.getTime() > currentDate.getTime())
  }
  
  // Determine which events to show, and how many.
  let shownEvents = 0
  let returnedEvents = []
  
  for (const event of todayEvents) {
    if (shownEvents == numberOfEvents) { break }
    if (shouldShowEvent(event)) {
      returnedEvents.push(event)
      shownEvents++
    }
  }

  // If there's room and we need to, show tomorrow's events.
  let multipleTomorrowEvents = false
  if (showTomorrow && shownEvents < numberOfEvents) {

    for (const event of tomorrowEvents) {
      if (shownEvents == numberOfEvents) { break }
      if (shouldShowEvent(event)) {
      
        // Add the tomorrow label prior to the first tomorrow event.
        if (!multipleTomorrowEvents) { 
          
          // The tomorrow label is pretending to be an event.
          returnedEvents.push({ title: localizedText.tomorrowLabel.toUpperCase(), isAllDay: true, isLabel: true })
          multipleTomorrowEvents = true
        }
        
        // Show the tomorrow event and increment the counter.
        returnedEvents.push(event)
        shownEvents++
      }
    }
  }
  return returnedEvents
}

// Determines if the provided date is at night.
function isNight(dateInput) {
  const timeValue = dateInput.getTime()
  return (timeValue < sunrise) || (timeValue > sunset)
}

// Determines if two dates occur on the same day
function sameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
}

/*
 * DRAWING FUNCTIONS
 * =================
 */

// Draw the vertical line in the tomorrow view.
function drawVerticalLine() {
  
  const w = 2
  const h = 20
  
  let draw = new DrawContext()
  draw.opaque = false
  draw.respectScreenScale = true
  draw.size = new Size(w,h)
  
  let barPath = new Path()
  const barHeight = h
  barPath.addRoundedRect(new Rect(0, 0, w, h), w/2, w/2)
  draw.addPath(barPath)
  draw.setFillColor(new Color("ffffff", 0.5))
  draw.fillPath()
  
  return draw.getImage()
}

// Draw the temp bar.
function drawTempBar() {

  // Set the size of the temp bar.
  const tempBarWidth = 200
  const tempBarHeight = 20
  
  // Calculate the current percentage of the high-low range.
  let percent = (currentTemp - todayLow) / (todayHigh - todayLow)

  // If we're out of bounds, clip it.
  if (percent < 0) {
    percent = 0
  } else if (percent > 1) {
    percent = 1
  }

  // Determine the scaled x-value for the current temp.
  const currPosition = (tempBarWidth - tempBarHeight) * percent

  // Start our draw context.
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
 * ELEMENTS AND ALIGNMENT
 * ======================
 */

// Create an aligned stack to add content to.
function align(column) {
  
  // Add the containing stack to the column.
  let alignmentStack = column.addStack()
  alignmentStack.layoutHorizontally()
  
  // Get the correct stack from the alignment function.
  let returnStack = currentAlignment(alignmentStack)
  returnStack.layoutVertically()
  return returnStack
}

// Create a right-aligned stack.
function alignRight(alignmentStack) {
  alignmentStack.addSpacer()
  let returnStack = alignmentStack.addStack()
  return returnStack
}

// Create a left-aligned stack.
function alignLeft(alignmentStack) {
  let returnStack = alignmentStack.addStack()
  alignmentStack.addSpacer()
  return returnStack
}

// Create a center-aligned stack.
function alignCenter(alignmentStack) {
  alignmentStack.addSpacer()
  let returnStack = alignmentStack.addStack()
  alignmentStack.addSpacer()
  return returnStack
}

// Display the date on the widget.
function date(column) {

  // Set up the date formatter and set its locale.
  let df = new DateFormatter()
  df.locale = lang
  
  // Show small if it's hard coded, or if it's dynamic and events are visible.
  if ((dynamicDateSize && eventsAreVisible) || staticDateSize == "small") {
    let dateStack = align(column)
    dateStack.setPadding(10, 10, 10, 10)

    df.dateFormat = smallDateFormat
    let dateText = dateStack.addText(df.string(currentDate))
    formatText(dateText, textFormat.smallDate)
    
  // Otherwise, show the large date.
  } else {
    let dateOneStack = align(column)
    df.dateFormat = largeDateLineOne
    let dateOne = dateOneStack.addText(df.string(currentDate))
    formatText(dateOne, textFormat.largeDate1)
    dateOneStack.setPadding(10, 10, 0, 10)
    
    let dateTwoStack = align(column)
    df.dateFormat = largeDateLineTwo
    let dateTwo = dateTwoStack.addText(df.string(currentDate))
    formatText(dateTwo, textFormat.largeDate2)
    dateTwoStack.setPadding(0, 10, 10, 10)
  }
}

function weatherKeypoint(column) {
  // Set up the greeting.
  let greetingStack = align(column)
  let greeting = greetingStack.addText(keypoint)
  formatText(greeting, textFormat.greeting)
  greetingStack.setPadding(10, 10, 10, 10)
}

function greeting(column) {

  // This function makes a greeting based on the time of day.
  function makeGreeting() {
    const hour = currentDate.getHours()
    if (hour    < 5)  { return localizedText.nightGreeting }
    if (hour    < 12) { return localizedText.morningGreeting }
    if (hour-12 < 5)  { return localizedText.afternoonGreeting }
    if (hour-12 < 10) { return localizedText.eveningGreeting }
    return localizedText.nightGreeting
  }
  
  // Set up the greeting.
  let greetingStack = align(column)
  let greeting = greetingStack.addText(makeGreeting())
  formatText(greeting, textFormat.greeting)
  greetingStack.setPadding(10, 10, 10, 10)
}

// Display events on the widget.
function events(column) {

  // If nothing should be displayed, just return.
  if (!eventsAreVisible && !localizedText.noEventMessage.length) { return }
  
  // Set up the event stack.
  let eventStack = column.addStack()
  eventStack.layoutVertically()
  const todaySeconds = Math.floor(currentDate.getTime() / 1000) - 978307200
  eventStack.url = 'calshow:' + todaySeconds
  
  // If there are no events, show the message and return.
  if (!eventsAreVisible) {
    let message = eventStack.addText(localizedText.noEventMessage)
    formatText(message, textFormat.greeting)
    eventStack.setPadding(10, 10, 10, 10)
    return
  }
  
  // If we're not showing the message, don't pad the event stack.
  eventStack.setPadding(0, 0, 0, 0)
  
  var currentStack = eventStack
  
  // Add each event to the stack.
  for (let i = 0; i < futureEvents.length; i++) {
    
    const event = futureEvents[i]
    
    // If it's the tomorrow label, change to the tomorrow stack.
    if (event.isLabel) {
      let tomorrowStack = column.addStack()
      tomorrowStack.layoutVertically()
      const tomorrowSeconds = Math.floor(currentDate.getTime() / 1000) - 978220800
      tomorrowStack.url = 'calshow:' + tomorrowSeconds
      currentStack = tomorrowStack
    }
    
    const titleStack = align(currentStack)
    const title = titleStack.addText(event.title)
    formatText(title, textFormat.eventTitle)
    titleStack.setPadding(i==0 ? 10 : 5, 10, event.isAllDay ? 5 : 0, 10)
  
    // If there are too many events, limit the line height.
    if (futureEvents.length >= 3) { title.lineLimit = 1 }

    // If it's an all-day event, we don't need a time.
    if (event.isAllDay) { continue }
    
    // Format the time information.
    let df = new DateFormatter()
    df.useNoDateStyle()
    df.useShortTimeStyle()
    let timeText = df.string(event.startDate)
    
    // If we show the length as time, add an en dash and the time.
    if (showEventLength == "time") { 
      timeText += "–" + df.string(event.endDate) 
      
    // If we should it as a duration, add the minutes.
    } else if (showEventLength == "duration") {
      const duration = (event.endDate.getTime() - event.startDate.getTime()) / (1000*60)
      timeText += " \u2022 " + Math.round(duration) + "分"
    }

    const timeStack = align(currentStack)
    const time = timeStack.addText(timeText)
    formatText(time, textFormat.eventTime)
    timeStack.setPadding(0, 10, i==futureEvents.length-1 ? 10 : 5, 10)
  }
}

// Display the current weather.
function current(column) {

  // Set up the current weather stack.
  let currentWeatherStack = column.addStack()
  currentWeatherStack.layoutVertically()
  currentWeatherStack.setPadding(0, 0, 0, 0)
  currentWeatherStack.url = "https://weather.com/weather/today/l/" + latitude + "," + longitude

  // Show the current condition symbol.
  let mainConditionStack = align(currentWeatherStack)
  let mainCondition = mainConditionStack.addImage(SFSymbol.named((mapSkycon(weather.
realtime.skycon)[1])).image)
  mainCondition.imageSize = new Size(22,22)
  mainConditionStack.setPadding(10, 10, 0, 10)

  // Show the current temperature.
  let tempStack = align(currentWeatherStack)
  let temp = tempStack.addText(Math.round(currentTemp) + "℃")
  tempStack.setPadding(0, 10, 0, 10)
  formatText(temp, textFormat.largeTemp)
  // If we're not showing the high and low, end it here.
  if (!showHighLow) { return }

  // Show the temp bar and high/low values.
  let tempBarStack = align(currentWeatherStack)
  tempBarStack.layoutVertically()
  tempBarStack.setPadding(0, 10, 5, 10)
  
  let tempBar = drawTempBar()
  let tempBarImage = tempBarStack.addImage(tempBar)
  tempBarImage.size = new Size(50,0)
  
  tempBarStack.addSpacer(1)
  
  let highLowStack = tempBarStack.addStack()
  highLowStack.layoutHorizontally()
  
  let mainLow = highLowStack.addText(Math.round(todayLow).toString())
  highLowStack.addSpacer()
  let mainHigh = highLowStack.addText(Math.round(todayHigh).toString())
  
  formatText(mainHigh, textFormat.tinyTemp)
  formatText(mainLow, textFormat.tinyTemp)
  
  tempBarStack.size = new Size(80,30)
  
  let infoStack = align(currentWeatherStack)
  infoStack.layoutVertically()
  infoStack.setPadding(0, 10, 5, 10)
  let appTemp = infoStack.addText("体感温度")
  let appTempN = infoStack.addText("      " + Math.round(currentAppTemp) + "℃")
  formatText(appTemp, textFormat.tinyName)
  formatText(appTempN, textFormat.mediumName)
  let Wind = infoStack.addText("風      ")
  let WindN = infoStack.addText("      " + currentWind)
  formatText(Wind, textFormat.tinyName)
  formatText(WindN, textFormat.mediumName)
  let Hum = infoStack.addText("湿      度")
  let HumN = infoStack.addText("      " + Math.round(currentHumidity) + "%")
  formatText(Hum, textFormat.tinyName)
  formatText(HumN, textFormat.mediumName)
  let UV = infoStack.addText("U V 指数")
  let UVN = infoStack.addText("      " + currentUV)
  formatText(UV, textFormat.tinyName)
  formatText(UVN, textFormat.mediumName)
  let AQ = infoStack.addText("空気質量")
  let AQN = infoStack.addText("      " + currentAQ)
  formatText(AQ, textFormat.tinyName)
  formatText(AQN, textFormat.mediumName)
}

// Display upcoming weather.
function future(column) {

  // Set up the future weather stack.
  let futureWeatherStack = column.addStack()
  futureWeatherStack.layoutVertically()
  futureWeatherStack.setPadding(0, 0, 0, 0)
  futureWeatherStack.url = "https://weather.com/weather/tenday/l/" + latitude + "," + longitude

  // Determine if we should show the next hour.
  const showNextHour = (currentDate.getHours() < tomorrowShownAtHour)
  
  // Set the label value.
  const subLabelText = showNextHour ? localizedText.nextHourLabel : localizedText.tomorrowLabel
  let subLabelStack = align(futureWeatherStack)
  let subLabel = subLabelStack.addText(subLabelText)
  formatText(subLabel, textFormat.smallTemp)
  subLabelStack.setPadding(0, 10, 2, 10)
  
  // Set up the sub condition stack.
  let subConditionStack = align(futureWeatherStack)
  subConditionStack.layoutHorizontally()
  subConditionStack.centerAlignContent()
  subConditionStack.setPadding(0, 10, 10, 10)
  
  // Determine what condition to show.
  var nightCondition
  if (showNextHour) {
    const addHour = currentDate.getTime() + (60*60*1000)
    const newDate = new Date(addHour)
    nightCondition = isNight(newDate)
  } else {
    nightCondition = false 
  }
  
  let subCondition = subConditionStack.addImage(SFSymbol.named((mapSkycon(weather.
hourly.skycon[1].value)[1])).image)
  const subConditionSize = showNextHour ? 14 : 18
  subCondition.imageSize = new Size(subConditionSize, subConditionSize)
  subConditionStack.addSpacer(5)
  
  // The next part of the display changes significantly for next hour vs tomorrow.
  if (showNextHour) {
    let subTemp = subConditionStack.addText(Math.round(nextHourTemp) + "℃")
    formatText(subTemp, textFormat.smallTemp)
    
  } else {
    let tomorrowLine = subConditionStack.addImage(drawVerticalLine())
    tomorrowLine.imageSize = new Size(3,28)
    subConditionStack.addSpacer(5)
    let tomorrowStack = subConditionStack.addStack()
    tomorrowStack.layoutVertically()
    
    let tomorrowHighText = tomorrowStack.addText(Math.round(tomorrowHigh) + "")
    tomorrowStack.addSpacer(4)
    let tomorrowLowText = tomorrowStack.addText(Math.round(tomorrowLow) + "")
    
    formatText(tomorrowHighText, textFormat.tinyTemp)
    formatText(tomorrowLowText, textFormat.tinyTemp)
  }
}

// Return a text-creation function.
function text(inputText) {
  
  function displayText(column) {
    let textStack = align(column)
    textStack.setPadding(10, 10, 10, 10)
    
    let textDisplay = textStack.addText(inputText)
    formatText(textDisplay, textFormat.customText)
  }
  return displayText
}




function mapWind(speed, direction) {
  let description = "";
  let d_description = "";

  if (speed < 1) {
    description = "0級";
    return description;
  } else if (speed <= 5) {
    description = "1級";
  } else if (speed <= 11) {
    description = "2級";
  } else if (speed <= 19) {
    description = "3級";
  } else if (speed <= 28) {
    description = "4級";
  } else if (speed <= 38) {
    description = "5級";
  } else if (speed <= 49) {
    description = "6級";
  } else if (speed <= 61) {
    description = "7級";
  } else if (speed <= 74) {
    description = "8級";
  } else if (speed <= 88) {
    description = "9級";
  } else if (speed <= 102) {
    description = "10級";
  } else if (speed <= 117) {
    description = "11級";
  } else if (speed <= 133) {
    description = "12級";
  } else if (speed <= 149) {
    description = "13級";
  } else if (speed <= 166) {
    description = "14級";
  } else if (speed <= 183) {
    description = "15級";
  } else if (speed <= 201) {
    description = "16級";
  } else if (speed <= 220) {
    description = "17級";
  }

  if (direction >= 348.76 || direction <= 11.25) {
    d_description = "北";
  } else if (direction >= 11.26 && direction <= 33.75) {
    d_description = "北北東";
  } else if (direction >= 33.76 && direction <= 56.25) {
    d_description = "北東";
  } else if (direction >= 56.26 && direction <= 78.75) {
    d_description = "東北東";
  } else if (direction >= 78.76 && direction <= 101.25) {
    d_description = "東";
  } else if (direction >= 101.26 && direction <= 123.75) {
    d_description = "東南東";
  } else if (direction >= 123.76 && direction <= 146.25) {
    d_description = "南東";
  } else if (direction >= 146.26 && direction <= 168.75) {
    d_description = "南南東";
  } else if (direction >= 168.76 && direction <= 191.25) {
    d_description = "南";
  } else if (direction >= 191.26 && direction <= 213.75) {
    d_description = "南南西";
  } else if (direction >= 213.76 && direction <= 236.25) {
    d_description = "南西";
  } else if (direction >= 236.26 && direction <= 258.75) {
    d_description = "西南西";
  } else if (direction >= 258.76 && direction <= 281.25) {
    d_description = "西";
  } else if (direction >= 281.26 && direction <= 303.75) {
    d_description = "西北西";
  } else if (direction >= 303.76 && direction <= 326.25) {
    d_description = "北西";
  } else if (direction >= 326.26 && direction <= 348.75) {
    d_description = "北北西";
  }

  return `${d_description}\n      ${description}`;
}

// 天气状况 --> 自然语言描述
// icon来源：github@58xinian
function mapSkycon(skycon) {
  const map = {
    CLEAR_DAY: [
      "☀️ 日间晴朗",
      "sun.max.fill",
      "https://raw.githubusercontent.com/58xinian/icon/master/Weather/CLEAR_DAY.gif",
    ],
    CLEAR_NIGHT: [
      "✨ 夜间晴朗",
      "moon.stars.fill",
      "https://raw.githubusercontent.com/58xinian/icon/master/Weather/CLEAR_NIGHT.gif",
    ],
    PARTLY_CLOUDY_DAY: [
      "⛅️ 日间多云",
      "cloud.sun.fill",
      "https://raw.githubusercontent.com/58xinian/icon/master/Weather/PARTLY_CLOUDY_DAY.gif",
    ],
    PARTLY_CLOUDY_NIGHT: [
      "☁️ 夜间多云",
      "cloud.moon.fill",
      "https://raw.githubusercontent.com/58xinian/icon/master/Weather/PARTLY_CLOUDY_NIGHT.gif",
    ],
    CLOUDY: [
      "☁️ 阴",
      "cloud.fill",
      "https://raw.githubusercontent.com/58xinian/icon/master/Weather/CLOUDY.gif",
    ],
    LIGHT_HAZE: [
      "😤 轻度雾霾",
      "smoke.fill",
      "https://raw.githubusercontent.com/58xinian/icon/master/Weather/HAZE.gif",
    ],
    MODERATE_HAZE: [
      "😤 中度雾霾",
      "smoke.fill",
      "https://raw.githubusercontent.com/58xinian/icon/master/Weather/HAZE.gif",
    ],
    HEAVY_HAZE: [
      "😤 重度雾霾",
      "smoke.fill",
      "https://raw.githubusercontent.com/58xinian/icon/master/Weather/HAZE.gif",
    ],
    LIGHT_RAIN: [
      "💧 小雨",
      "cloud.drizzle.fill",
      "https://raw.githubusercontent.com/58xinian/icon/master/Weather/LIGHT.gif",
    ],
    MODERATE_RAIN: [
      "💦 中雨",
      "cloud.rain.fill",
      "https://raw.githubusercontent.com/58xinian/icon/master/Weather/MODERATE_RAIN.gif",
    ],
    HEAVY_RAIN: [
      "🌧 大雨",
      "cloud.heavyrain.fill",
      "https://raw.githubusercontent.com/58xinian/icon/master/Weather/STORM_RAIN.gif",
    ],
    STORM_RAIN: [
      "⛈ 暴雨",
      "cloud.heavyrain.fill",
      "https://raw.githubusercontent.com/58xinian/icon/master/Weather/STORM_RAIN.gif",
    ],
    LIGHT_SNOW: [
      "🌨 小雪",
      "cloud.snow.fill",
      "https://raw.githubusercontent.com/58xinian/icon/master/Weather/LIGHT_SNOW.gif",
    ],
    MODERATE_SNOW: [
      "❄️ 中雪",
      "cloud.snow.fill",
      "https://raw.githubusercontent.com/58xinian/icon/master/Weather/MODERATE_SNOW.gif",
    ],
    HEAVY_SNOW: [
      "☃️ 大雪",
      "snow",
      "https://raw.githubusercontent.com/58xinian/icon/master/Weather/HEAVY_SNOW.gif",
    ],
    STORM_SNOW: [
      "⛄️暴雪",
      "snow",
      "https://raw.githubusercontent.com/58xinian/icon/master/Weather/HEAVY_SNOW",
    ],
    DUST: ["💨 浮尘","smoke.fill",],
    SAND: ["💨 沙尘","smoke.fill",],
    WIND: ["🌪 大风","wind",],
  };
  return map[skycon];
}

// 雷达降 水/雪 强度 --> skycon
function mapPrecipitation(intensity) {
  if (0.031 < intensity && intensity < 0.25) {
    return "LIGHT";
  } else if (intensity < 0.35) {
    return "MODERATE";
  } else if (intensity < 0.48) {
    return "HEADY";
  } else if (intensity >= 0.48) {
    return "STORM";
  }
}




/*
 * MINI FUNCTIONS
 * ==============
 */

// This function adds a space.
function space(column) { column.addSpacer() }

// Change the current alignment to right.
function right(x) { currentAlignment = alignRight }

// Change the current alignment to left.
function left(x) { currentAlignment = alignLeft }

// Change the current alignment to center.
function center(x) { currentAlignment = alignCenter }

// This function doesn't need to do anything.
function end(x) { return }

Script.complete()
