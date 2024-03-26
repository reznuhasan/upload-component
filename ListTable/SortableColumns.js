import React, { useState, useEffect, useRef } from 'react';
import Button from '@Components/Button';
import { __ } from '@wordpress/i18n';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';

const SortableColumnItem = sortableElement(({ copyColumn, itemIndex, checkedChange }) => {

    return (
        <div
            className='kzui-list-table__filter-checked-item'
            key={`column-${itemIndex}`}
        >
            <span className="kzui-list-table-filter-item-left">
                <span className="academy-icon academy-icon--move"></span>
                <span className="kzui-list-table-filter-item-title">
                    {copyColumn.name}
                </span>
            </span>
            <input
                id={copyColumn.name}
                type="checkbox"
                checked={copyColumn.visible}
                onChange={(event) =>
                    checkedChange({ id: copyColumn.id, visible: event.target.checked })
                }
            />
        </div>
    )
})

const SortableColumnItemContainer = sortableContainer((props) => {
    return <ul className="kzui-list-table__filter-items">{props.children}</ul>;
});

const SortableColumns = ({
    setTempCopyColumns,
    tempCopyColumns,
    showColumnFilter,
    checkedChange,
    setCopyColumns,
    copyColumns,
    suffix
}) => {
    const [modalOpen, isModalOpen] = useState(false);
    const modalRef = useRef(null);
    const relativeTo = useRef(null);

    const onSortEnd = ({ oldIndex, newIndex }) => {
        const sortedColumn = arrayMoveImmutable(tempCopyColumns, oldIndex, newIndex);
        setTempCopyColumns(sortedColumn);
    };

    const handleToggle = () => {
        isModalOpen(modalOpen ? false : true);
    }

    const handleClick = (e) => {
        if (
            modalRef?.current &&
            !modalRef?.current?.contains(e.target) &&
            !relativeTo.current.contains(e.target)
        ) {
            isModalOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    return (
        <div
            className="kzui-list-table__sub-header-filter-icon"
            ref={relativeTo}
        >
            <Button
                label={__("Columns", 'storeengine')}
                icon={<span className="academy-icon academy-icon--plus"></span>}
                onClick={handleToggle}
                preset="transparent"
                border="gray"
                size="sm"
                borderRadius="rounded"
            />
            {modalOpen && (
                <div
                    className={`kzui-list-table__filter-modal`}
                    ref={modalRef}
                >
                    <>
                        <div className="kzui-list-table__filter-modal__top-bar">
                            <span>{__('Columns', 'storeengine')}</span>
                            <Button
                                label={__("Reset", "storeengine")}
                                onClick={() => {
                                    setTempCopyColumns(tempCopyColumns.map(column => ({ ...column, visible: true })));
                                }}
                                preset="transparent"
                                size="sm"
                                type="button"
                                suffix="reset-all"
                            />
                        </div>

                        {showColumnFilter && (
                            <SortableColumnItemContainer onSortEnd={onSortEnd}>
                                {tempCopyColumns?.map((item, index) => (
                                    <SortableColumnItem
                                        key={`column-${index}`}
                                        index={index}
                                        copyColumn={item}
                                        itemIndex={index}
                                        checkedChange={checkedChange}
                                    />
                                ))}
                            </SortableColumnItemContainer>
                        )}

                        <div className="kzui-list-table__filter-modal__footer">
                            <Button
                                label={__("Cancel", 'storeengine')}
                                onClick={() => {
                                    setTempCopyColumns([...copyColumns]);
                                    isModalOpen(false);
                                }}
                                preset="transparent"
                                size="sm"
                                type="button"
                                suffix="cancel"
                                border="gray"
                                borderRadius="rounded"
                            />

                            <Button
                                label={__("Apply", 'storeengine')}
                                onClick={() => {
                                    setCopyColumns(tempCopyColumns);
                                    localStorage.setItem(suffix, JSON.stringify(tempCopyColumns));
                                    isModalOpen(false);
                                }}
                                size="sm"
                                borderRadius="rounded"
                            />
                        </div>
                    </>
                </div>
            )}
        </div>
    );
};

export default SortableColumns;