import React from 'react'
import R from 'ramda'
import { strCol, numCol, boolCol, selCol } from '../cols'
import Chance from 'chance'
const chance = new Chance()
//** test helpers
const randomRow = R.compose(
  R.fromPairs,
  R.map(({ ident, type }) => {
    switch (type) {
      case 'str':
      case 'sel':
        return [ident, chance.word()]
      case 'num':
        return [ident, chance.floating({ fixed: 2, min: 0, max: 50000 })]
      case 'bool':
        return [ident, chance.bool()]
    }
  })
)

const createRow = _ => randomRow(headers)

const createData = R.compose(R.map(createRow), R.range(1))

/* prettier-ignore */
const headers = [
  strCol({ ident: 'unitId', display: 'Unit' }),
  strCol({ ident: 'he', display: 'HE' }),
  strCol({ ident: 'fixedGen', display: 'Fixed Gen' }),
  numCol({ ident: 'emerMinOvr', display: 'Emer Min' }),
  numCol({ ident: 'ecoMinOvr', display: 'Eco Min' }),
  numCol({ ident: 'ecoMaxOvr', display: 'Eco Max' }),
  numCol({ ident: 'emerMaxOvr', display: 'Emer Max' }),
  strCol({ ident: 'commitStatusOvr', display: 'Commit Status', }),
  strCol({ ident: 'commitStatus', display: 'Commit Status' }),
  numCol({ ident: 'regMwOvr', display: 'Reg Mw' }),
  numCol({ ident: 'regMinOvr', display: 'Reg Min' }),
  numCol({ ident: 'regMaxOvr', display: 'Reg Max' }),
  strCol({ ident: 'regAStatusOvr', display: 'Reg A Status' }),
  strCol({ ident: 'spilling', display: 'Spilling' }),
  numCol({ ident: 'reducedRampRatePct', display: 'Reduce Ramp Percent', }),
  numCol({ ident: 'regAPrice', display: 'Reg A Price' }),
  numCol({ ident: 'regACost', display: 'Reg A Cost' }),
  numCol({ ident: 'regAPerfPrice', display: 'Reg A Perf Price', }),
  numCol({ ident: 'regAPerfCost', display: 'Reg A Perf Cost' }),
  strCol({ ident: 'regDStatus', display: 'Reg D status' }),
  numCol({ ident: 'regDPrice', display: 'Reg D Price' }),
  numCol({ ident: 'regDCost', display: 'Reg D Cost' }),
  numCol({ ident: 'regDPerfPrice', display: 'Reg D Perf Price', }),
  numCol({ ident: 'regDPerfCost', display: 'Reg D Perf Cost' }),
  numCol({ ident: 'spinMwOvr', display: 'Spin Mw' }),
  numCol({ ident: 'spinMaxOvr', display: 'Spin Max' }),
  strCol({ ident: 'spinStatusOvr', display: 'Spin Status' }),
  numCol({ ident: 'spinPrice', display: 'Spin Price' }),
]

const sumWidth = R.compose(R.sum, R.map(({ width }) => width))

const flexCellStyle = ({ width }) => ({
  flex: `0 0 ${width}px`,
})

const flexRowStyle = ({ rowWidth }) => ({
  display: 'flex',
  width: sumWidth(headers),
})

const defaultHeaderRenderer = ({
  className,
  ident,
  display,
  style,
  ...rest
}) => (
  <div className={className} style={style}>
    {display}
  </div>
)

const DivPassThrough = props => <div {...props}> {props.children} </div>

// render
const defaultCellRenderer = ({ className, style, value, formatter }) => (
  <div className={className} style={style}>
    {value}
  </div>
)

class FlexGrid extends React.Component {
  state = { selectedRow: [], hoveredRow: undefined }

  getColumnHeaderProps = ({ key, ...rest }) => ({
    key,
    style: flexCellStyle(rest),
  })

  getRowProps = ({ key, index, isHeader = false, style, onClick }) => ({
    key,
    style: {
      ...flexRowStyle({
        rowWidth: this.props.rowWidth || sumWidth(this.props.headers),
      }),
      //let input style override
      ...style,
    },
    isSelected: !isHeader && this.state.selectedRow.contains(index),
    isHovered: !isHeader && this.state.hoveredRow === index,
    //TODO add on click and remember to call the input onClick as well as
  })

  getCellProps = ({ key, rowIndex, columnIndex, header, data, style }) => ({
    key,
    rowIndex,
    columnIndex,
    style: {
      ...flexCellStyle({
        width,
      }),
      ...style,
    },
  })

  renderColumnContent = ({ display }) => 'header-content'

  renderCellContent = ({ header, rowIndex, columnIndex, data }) =>
    'cell-content'

  render() {
    return this.props.children({
      getColumnHeaderProps: this.getColumnHeaderProps,
      getRowProps: this.getRowProps,
      getCellProps: this.getCellProps,
    })
  }
}

class SimpleGrid extends React.Component {
  state = { selectedRow: [] }

  renderFlex() {
    const {
      data,
      headers,
      headerRenderer = defaultHeaderRenderer,
      cellRenderer = defaultCellRenderer,
      HeaderRowComponent = DivPassThrough,
      RowComponent = DivPassThrough,
      rowWidth = sumWidth(headers),
      style,
      className,
    } = this.props

    const rowStyle = flexRowStyle({ headers, rowWidth })
    return (
      <div style={style} className={className}>
        <HeaderRowComponent style={rowStyle}>
          {headers.map(header =>
            headerRenderer({ ...header, style: flexCellStyle(header) })
          )}
        </HeaderRowComponent>
        {data.map(row => (
          <RowComponent style={rowStyle}>
            {headers.map(header =>
              cellRenderer({
                style: flexCellStyle(header),
                value: row[header.ident],
                ...header,
              })
            )}
          </RowComponent>
        ))}
      </div>
    )
  }

  render() {
    return this.renderFlex()
  }
}

const GridDemo = () => {
  return <SimpleGrid headers={headers} data={createData(15)} />
}

export default GridDemo
