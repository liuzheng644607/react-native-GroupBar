
/**
 * 分组滑动组件
 * 比如联系人按拼音分组, 侧边栏滑动快速选择
 * index的值不能重复
 * example:
 * 
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
 */

import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class GroupBar extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            indexs: [],
        }
        // 当前划过的索引
        this.curKey = null;
    }
    componentWillMount() {
        let { indexs } = this.props;
        indexs = indexs || [];
        this.setState({
            indexs
        });
    }
    componentWillUnmount() {
        // 卸载时清空
        this.curKey = null;
        this.state = null;
        this._unmount = true;
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.indexs) {
            this.setState({
                indexs: nextProps.indexs
            });
        }
    }
    renderBar() {
        let {indexs} = this.state;
        return indexs.map((bar, i) => {
            // indexs 的每项 支持string / object类型
            let type = typeof bar;
            let inner = null;
            // 当前项的索引值
            let index = null;
            if (type === 'string' || type === 'number') {
                inner = <Text style={this.props.fontStyle}>{bar}</Text>;
                index = bar;
            }
            if (type === 'object' 
                && typeof bar.render === 'function'
                && bar.index !== undefined) {
                // object 类型的项需要传入 render 和 index 选项
                inner = bar.render(bar, i);
                index = bar.index;
            }
            return (
                <View key={i} onLayout={this._itemlayout.bind(this, index)} style={this.props.itemStyle}>
                {inner}
                </View>
            );
        })
    }
    _touchmove(e) {
        let { locationX, locationY , pageY, pageX} = e.nativeEvent;
        // 滑动方向 ,支持垂直 和水平滑动
        let { direction } = this.props;
        let isVertical = direction === 'vertical';
        let diff = isVertical ? (pageY - this.rect.pageY) : (pageX - this.rect.pageX);
        let nkey = null;
        for (var key in this.barItems) {
            if (!this.barItems.hasOwnProperty(key) || key === nkey) {
                continue;
            }
            // 起始边界
            let start = this.barItems[key][isVertical ? 'y' : 'x'];
            // 每个元素的范围
            let range = this.barItems[key][isVertical ? 'height' : 'width'];
            // 元素结束边界
            let end = start + range;
            if (diff >= start && diff < end) {
                if (key !== nkey) {
                    nkey = key;
                    break;
                }
            }
        }
        if (nkey && this.curKey !== nkey) {
            this.curKey = nkey;
            if (typeof this.props.onChange === 'function') {
                this.props.onChange(nkey, e);
            }
        } else {
            this.curKey = null;
        }
        if (this.props.onTouchMove) {
            this.props.onTouchMove(e);
        }
    }
    _innerLayout(e) {
        this.refs.bar.measure((x, y, width, height, pageX, pageY) => {
            if(this._unmount) return;
            this.rect = {x, y, width, height, pageX, pageY};
        });
        if (this.props.onLayout) {
            this.props.onLayout(e);
        }
    }
    _itemlayout(key, e) {
        // 保存好每个元素的 大小、坐标, 以index为 key
        if (!this.barItems) {
            this.barItems = {};
        }
        key && (this.barItems[key] = e.nativeEvent.layout);
    }
    render() {
        return(
            <View
            {...this.props}
            ref='bar'
            onLayout={this._innerLayout.bind(this)}
            onTouchMove={this._touchmove.bind(this)}
            >
            {this.props.children}
            {this.renderBar()}
            </View>
        )
    }
}
GroupBar.propTypes = {
    ...View.propTypes,
    // index值不能重复
    indexs: React.PropTypes.array,
    // 手指滑过时的回调
    onChange: React.PropTypes.func,
    // 方向
    direction: React.PropTypes.oneOf(['vertical', 'horizontal'])
};

GroupBar.defaultProps = {
    indexs: [],
    direction: 'vertical',
    itemStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    fontStyle: {
        backgroundColor: 'rgba(0,0,0,0)'
    },
}