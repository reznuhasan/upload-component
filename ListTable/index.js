import React, { useState, useEffect } from 'react';
import Pagination from '@Components/Pagination';
import Preloader from '@Components/Loader/Preloader';
import PropTypes from 'prop-types';
import CustomTableMessage from '@Components/Oops/CustomTableMessage';
import { __, sprintf } from '@wordpress/i18n';
import { is_admin } from '@Utils/helper';
import SortableColumns from './SortableColumns';
import './styles.scss';

const propTypes = {
    columns: PropTypes.array,
    data: PropTypes.array,
    isRowSelectable: PropTypes.bool,
    getSelectRowValue: PropTypes.function,
    showSubHeader: PropTypes.bool,
    subHeaderComponent: PropTypes.function,
    showColumnFilter: PropTypes.bool,
    showPagination: PropTypes.bool,
    totalRows: PropTypes.number,
    onChangePage: PropTypes.function,
    onChangeItemsPerPage: PropTypes.function,
    suffix: PropTypes.string,
    totalItems: PropTypes.number,
    dataFetchingStatus: PropTypes.bool,
    resetSelected: PropTypes.bool,
};

const defaultProps = {
    columns: [],
    data: [],
    isRowSelectable: true,
    getSelectRowValue: () => { },
    showSubHeader: true,
    subHeaderComponent: () => { },
    showColumnFilter: true,
    showPagination: false,
    totalRows: 0,
    onChangePage: () => { },
    onChangeItemsPerPage: () => { },
    suffix: "",
    totalItems: 0,
    dataFetchingStatus: false,
    resetSelected: false,
};

const ListTable = (props) => {
    const {
        columns,
        data,
        isRowSelectable,
        getSelectRowValue,
        showSubHeader,
        subHeaderComponent,
        showColumnFilter,
        showPagination,
        totalRows,
        onChangePage,
        onChangeItemsPerPage,
        suffix,
        totalItems,
        dataFetchingStatus,
        resetSelected,
    } = props

    // ListTable state
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [copyDataArr, setCopyDataArr] = useState([]);
    const [copyColumns, setCopyColumns] = useState(columns?.map((copyColumn, index) => ({ ...copyColumn, visible: true, id: `column-${index}` })));
    const [visibleColumn, setVisibleColumn] = useState(copyColumns?.filter(copyColumn => copyColumn.visible));
    const [tempCopyColumns, setTempCopyColumns] = useState([...copyColumns]);
    const [showSlider, setShowSlider] = useState(false);

    // actions
    const isCheckboxChecked = data.length > 0 && copyDataArr;
    const isCheckboxColumnVisible = visibleColumn.length > 0 && isRowSelectable;


    const selectRowChange = ({ row, select }) => {
        const updatedDataArr = copyDataArr.map(data => {
            if (
                parseInt(data.id) === parseInt(row.id) ||
                parseInt(data.ID) === parseInt(row.ID) ||
                parseInt(data.attempt_id) === parseInt(row.attempt_id) ||
                parseInt(data.comment_ID) === parseInt(row.comment_ID)
            ) {
                return { ...data, select };
            }
            return data;
        });
        setCopyDataArr(updatedDataArr);
    }
    const selectAllRow = (event) => setCopyDataArr(prev => prev.map(data => ({ ...data, select: event.target.checked })));

    const checkedChange = ({ id, visible }) => {
        let updatedColumns;

        if (id === "reset") {
            updatedColumns = tempCopyColumns.map(column => ({ ...column, visible: true }));
        } else {
            updatedColumns = tempCopyColumns.map(column => {
                if (column.id === id) {
                    return { ...column, visible };
                }
                return column;
            });
        }

        setTempCopyColumns(updatedColumns);
    };

    const paginationPerPageChange = event => {
        setRowsPerPage(event.target.value);
        onChangeItemsPerPage(parseInt(event.target.value), parseInt(currentPage))
    }

    //side effect
    useEffect(() => {
        setCopyDataArr(data && data?.map(row => ({ ...row, select: false })))
    }, [data])

    useEffect(() => {
        function handleResponsiveSlideShow() {
            if (window.innerWidth < 1280) {
                setShowSlider(true)
            } else {
                setShowSlider(false)
            }
        }

        // Add event listener for window resize
        window.addEventListener('resize', handleResponsiveSlideShow);

        // Initial check on component mount
        handleResponsiveSlideShow();

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResponsiveSlideShow);
        };
    }, [window.innerWidth]);

    useEffect(() => {
        setVisibleColumn(copyColumns?.filter(copyColumn => copyColumn.visible))
    }, [copyColumns])

    // get Local storage data every time page refresh
    useEffect(() => {
        const localColumns = JSON.parse(localStorage.getItem(suffix));
        if (localColumns) {
            const mergeColumns = copyColumns.reduce((acc, column) => {
                const columns = localColumns.map(item => {
                    if (item.id === column.id) {
                        acc.push({ ...item, cell: column.cell });

                    }
                })
                return acc;
            }, [])
            setTempCopyColumns(mergeColumns);
            setCopyColumns(mergeColumns);
        }
    }, [])

    // current select row
    useEffect(() => {
        if (typeof getSelectRowValue === 'function')
            getSelectRowValue(copyDataArr && copyDataArr?.filter(copyRow => copyRow.select))
    }, [copyDataArr])

    // reset selected
    useEffect(() => {
        if (resetSelected) {
            setCopyDataArr(data && data?.map(row => ({ ...row, select: false })))
        }
    }, [resetSelected])


    return (
        <div
            className={`kzui-list-table ${suffix && 'kzui-list-table--' + suffix} ${!is_admin ? 'academy-dashboard__content' : ''}`
            }>
            <div className="kzui-list-table__container ">
                {showSubHeader && (
                    <div className='kzui-list-table__sub-header'>
                        <div className="kzui-list-table__sub-header-left">
                            {subHeaderComponent}
                        </div>
                        <div className="kzui-list-table__sub-header-right">
                            {showColumnFilter && (
                                <SortableColumns
                                    setTempCopyColumns={setTempCopyColumns}
                                    tempCopyColumns={tempCopyColumns}
                                    showColumnFilter={showColumnFilter}
                                    checkedChange={checkedChange}
                                    setCopyColumns={setCopyColumns}
                                    copyColumns={copyColumns}
                                    suffix={suffix}
                                />
                            )}
                        </div>
                    </div>
                )}

                <div className={`kzui-list-table__table ${showSlider && 'kzui-list-table--has-slider'}`}>
                    <div className="kzui-list-table__table-head">
                        <div
                            className="kzui-list-table__table-head-row"
                        >
                            {isCheckboxColumnVisible && (
                                <div className="kzui-list-table__table-row-cell kzui-list-table__table-row-cell-checkbox">
                                    <input
                                        checked={isCheckboxChecked && copyDataArr?.every(row => row.select)}
                                        type="checkbox"
                                        onChange={selectAllRow}
                                    />
                                </div>
                            )}

                            {visibleColumn?.map((column, index) => (
                                <div
                                    className="kzui-list-table__table-row-cell kzui-list-table__table-header-row-cell"
                                    key={index}
                                >
                                    {column.name}
                                </div>
                            ))
                            }
                        </div>
                    </div>
                    <div className="kzui-list-table__table-body">
                        {dataFetchingStatus ? (
                            <div className="kzui-list-table__loader">
                                <Preloader />
                            </div>
                        ) : (
                            <>
                                {copyDataArr?.length > 0 ? (
                                    <>
                                        {copyDataArr?.map((row, index) => (
                                            <div key={index} className="kzui-list-table__table-body-row">
                                                {isCheckboxColumnVisible && (
                                                    <div className="kzui-list-table__table-row-cell kzui-list-table__table-row-cell-checkbox ">
                                                        <input
                                                            type="checkbox"
                                                            checked={row.select}
                                                            onChange={(event) => selectRowChange({ row, select: event.target.checked })}
                                                        />
                                                    </div>
                                                )}
                                                {visibleColumn.length > 0 ? (
                                                    <>
                                                        {
                                                            visibleColumn?.map((copyColumn, index) => (
                                                                <div
                                                                    className='kzui-list-table__table-row-cell'
                                                                    key={index}
                                                                >
                                                                    {copyColumn?.cell(row)}
                                                                </div>
                                                            ))
                                                        }
                                                    </>
                                                ) : (
                                                    <CustomTableMessage
                                                        title={__('No visible columns available!!', 'storeengine')}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <CustomTableMessage
                                        title={__('No data Available!!', 'storeengine')}
                                    />
                                )}
                            </>
                        )}

                    </div>
                </div>
                {showPagination && (
                    <div className="kzui-list-table__footer">
                        <span className="kzui-list-table__footer-left">
                            {sprintf(__("Showing result %s out of %s"), data?.length, totalItems)}
                        </span>
                        <div className="kzui-list-table__footer-right">
                            <div className='kzui-list-table__footer-pagination per__page' >
                                <p>{__("Rows per page", "storeengine")}</p>
                                <select onChange={paginationPerPageChange} value={rowsPerPage} >
                                    <option value="10">{__("10", "storeengine")}</option>
                                    <option value="15">{__("15", "storeengine")}</option>
                                    <option value="20">{__("20", "storeengine")}</option>
                                    <option value="25">{__("25", "storeengine")}</option>
                                    <option value="30">{__("30", "storeengine")}</option>
                                </select>
                            </div>
                            <div className='kzui-list-table__footer-pagination-pages icons'>
                                <Pagination
                                    totalItems={totalItems}
                                    fetchHandler={onChangePage}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
};

ListTable.propTypes = propTypes;
ListTable.defaultProps = defaultProps;
export default ListTable;