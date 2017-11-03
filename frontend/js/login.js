//将首页的登陆功能都转到登陆页，首页只判断是否有cookie，有就跳到list页，没有就跳login页，每次进入login页就清掉cookie
//list页每次进入判断是否有cookie，有就显示，没有就跳login
//其他页同理
//整理一下思路，整个流程：判断是否有cookie，没有就login，有就显示，login一进入就清数据，每次发请求如果999999就跳login页