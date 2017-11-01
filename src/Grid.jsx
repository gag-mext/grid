/* tslint:disable:jsx-no-multiline-js */
import '../style';
import React from 'react';
import classNames from 'classnames';
import Flex from '@gag/flex';
import Carousel from '@gag/carousel';

class Grid extends React.Component{
  constructor(props) {
  super(props);
  this.state = {
    initialSlideWidth: 0, // only used in carousel model
  };
}
componentDidMount() {
  this.setState({
    initialSlideWidth: document.documentElement.clientWidth,
  });
}
renderCarousel = (rowsArr, pageCount, rowCount) => {
  const { prefixCls } = this.props;
  const carouselMaxRow = this.props.carouselMaxRow;
  const pagesArr: any[] = [];
  for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
    const pageRows: any[] = [];
    for (let ii = 0; ii < carouselMaxRow; ii++) {
      const rowIndex = pageIndex * carouselMaxRow + ii;
      if (rowIndex < rowCount) {
        pageRows.push(rowsArr[rowIndex]);
      } else {
        // 空节点为了确保末尾页的最后未到底的行有底线(样式中last-child会没线)
        pageRows.push(<div key={`gridline-${rowIndex}`} />);
      }
    }
    pagesArr.push(<div key={`pageitem-${pageIndex}`} className={`${prefixCls}-carousel-page`}>{pageRows}</div>);
  }
  return pagesArr;
}
renderItem = (dataItem: DataItem, index: number, columnNum: number, renderItem: any) => {
  const { prefixCls } = this.props;
  return (
    <div
      className={`${prefixCls}-item-content`}
    >
      {renderItem ? renderItem(dataItem, index) :
        <div className={`${prefixCls}-item-inner-content column-num-${columnNum}`}>
          {
            React.isValidElement(dataItem.icon) ? dataItem.icon : (
              <img className={`${prefixCls}-icon`} src={dataItem.icon} />
            )
          }
          <div className={`${prefixCls}-text`}>{dataItem.text}</div>
        </div>
      }
    </div>
  );
}
render() {
  const { prefixCls, className, data, hasLine, isCarousel, ...restProps } = this.props;
  let { columnNum, carouselMaxRow, onClick = () => {}, renderItem, ...restPropsForCarousel } = restProps;
  columnNum = columnNum;
  carouselMaxRow = carouselMaxRow;

  const { initialSlideWidth } = this.state;

  const dataLength = data && data.length || 0;
  const rowCount = Math.ceil(dataLength / columnNum);
  const rowWidth = `${100 / columnNum}%`;
  const colStyle = {
    width: rowWidth,
  };

  const rowsArr: any[] = [];

  for (let i = 0; i < rowCount; i++) {
    const rowArr: any[] = [];
    for (let j = 0; j < columnNum; j++) {
      const dataIndex = i * columnNum + j;
      if (dataIndex < dataLength) {
        const el = data && data[dataIndex];
        rowArr.push(<Flex.Item
          key={`griditem-${dataIndex}`}
          className={`${prefixCls}-item`}
          onClick={() => onClick(el, dataIndex)}
          style={colStyle}
        >
          {el && this.renderItem(el, dataIndex, columnNum, renderItem)}
        </Flex.Item>);
      } else {
        rowArr.push(<Flex.Item
          key={`griditem-${dataIndex}`}
          style={colStyle}
        />);
      }
    }
    rowsArr.push(<Flex justify="center" align="stretch" key={`gridline-${i}`}>{rowArr}</Flex>);
  }

  const pageCount = Math.ceil(rowCount / carouselMaxRow);
  const isCarouselMode = isCarousel && pageCount > 1;
  let renderEl;
  if (isCarouselMode) {
    if (initialSlideWidth > 0) {
      renderEl = (
        <Carousel initialSlideWidth={initialSlideWidth} {...restPropsForCarousel}>
          {this.renderCarousel(rowsArr, pageCount, rowCount)}
        </Carousel>
      );
    } else {
      // server side render
      renderEl = null;
    }
  } else {
    renderEl = rowsArr;
  }

    return (
      <div
        className={classNames({
          [prefixCls]: true,
          [`${prefixCls}-line`]: hasLine,
          [className]: className,
        })}
      >
        {renderEl}
      </div>
    );
  }
}
Grid.defaultProps = {
      data: [],
      hasLine: true,
      isCarousel: false,
      columnNum: 4,
      carouselMaxRow: 2,
      prefixCls: 'am-grid'
};
Grid.propTypes = {
      data:React.PropTypes.array,
      hasLine:React.PropTypes.bool,
      columnNum:React.PropTypes.number,
      isCarousel:React.PropTypes.bool,
      carouselMaxRow:React.PropTypes.number,
      onClick:React.PropTypes.func,
      /** web only */
      renderItem:React.PropTypes.func,
      prefixCls: React.PropTypes.string,
      className: React.PropTypes.string
};
Grid.displayName = "Grid";
module.exports=Grid;
