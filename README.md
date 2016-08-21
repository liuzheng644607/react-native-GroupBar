# react-native-GroupBar
一个RN的分组栏组件, 比如手机联系人旁的拼音滑动栏
---
![demo](https://github.com/liuzheng644607/react-native-GroupBar/blob/master/demo.gif)

# Props
## indexs [Array]
 必须传递每一项都是一个索引，每项支持string/number  和 object 的方式.
 ```
    var indexs = [
        'A', 'B', 'C', 'Z',
        // 支持自定义每项, 必须要有render方法和index, 
        // index 为每项的唯一标示. 
        {
            index: '#',
            render: (item) => {
                return (
                    <Text>{item.index}</Text>
                )
            }
        }
    ]
   <GroupBar 
        indexs={indexs} 
        onChange={this.onChange.bind(this)}
        fontStyle={{color: 'rgba(5, 169, 214, 0.5)',fontSize: 14, backgroundColor: 'rgba(0,0,0,0)'}}
        style={{flex: 1, height: 300}}
        >
    </GroupBar>
 ```
## onChange [function]
 滑过选中某项的时候触发

## direction [string]
 方向, ```vertical``` 或者 ```horizontal``` 

## itemStyle
 每项的样式

## fontStyle
 字体样式, 自定义项无效

## ...View.propTypes