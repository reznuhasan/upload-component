import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@Components/Button';
import './styles.scss';

const propTypes = {
	totalItems: PropTypes.number,
	fetchHandler: PropTypes.func,
};
const defaultProps = {
	totalItems: 0,
	page: 1,
	fetchHandler: () => {},
};
const Pagination = ({ totalItems, fetchHandler }) => {
	const [page, setPage] = useState(1);
	const totalPages = Math.ceil(totalItems / 10) || 0;
	const pageNumbers = Array.from(
		{ length: totalPages },
		(_, index) => index + 1
	);
	const showNextButton = page < pageNumbers.length && totalItems > 10;
	const showPrevButton = page > 1 && totalItems > 10;

	const handlePageChange = (newPage) => {
		setPage(newPage);
		fetchHandler(newPage);
	};

	const renderPageNumbers = () => {
		const renderedPages = [];
		if (pageNumbers.length <= 5) {
			// when total number of pages is less than or equal to 35, render all the page numbers
			pageNumbers.forEach((item, index) => {
				const pageItem = (
					<li
						className={`storeengine-pagination-list__item ${
							item === page &&
							'storeengine-pagination-list__item-active'
						}`}
						key={index}
						onClick={() => {
							handlePageChange(item);
						}}
						role="presentation"
					>
						{item}
					</li>
				);
				renderedPages.push(pageItem);
			});
		} else if (page <= 3) {
			// when current page is within the first three pages
			for (let i = 1; i <= 3; i++) {
				const pageItem = (
					<li
						className={`storeengine-pagination-list__item ${
							i === page && 'storeengine-pagination-list__item-active'
						}`}
						key={i}
						onClick={() => {
							handlePageChange(i);
						}}
						role="presentation"
					>
						{i}
					</li>
				);
				renderedPages.push(pageItem);
			}
			renderedPages.push(
				<li
					className="storeengine-pagination-list__item storeengine-pagination-list__item-dots"
					key="dots"
				>
					...
				</li>
			);
			const lastPageItem = (
				<li
					className="storeengine-pagination-list__item"
					key={totalPages}
					onClick={() => {
						handlePageChange(totalPages);
					}}
					role="presentation"
				>
					{totalPages}
				</li>
			);
			renderedPages.push(lastPageItem);
		} else if (page >= totalPages - 2) {
			// when current page is within the last three pages
			const firstPageItem = (
				<li
					className="storeengine-pagination-list__item"
					key={1}
					onClick={() => {
						handlePageChange(1);
					}}
					role="presentation"
				>
					{1}
				</li>
			);
			renderedPages.push(firstPageItem);
			renderedPages.push(
				<li
					className="storeengine-pagination-list__item storeengine-pagination-list__item-dots"
					key="dots"
				>
					...
				</li>
			);
			for (let i = totalPages - 2; i <= totalPages; i++) {
				const pageItem = (
					<li
						className={`storeengine-pagination-list__item ${
							i === page && 'storeengine-pagination-list__item-active'
						}`}
						key={i}
						onClick={() => {
							handlePageChange(i);
						}}
						role="presentation"
					>
						{i}
					</li>
				);
				renderedPages.push(pageItem);
			}
		} else {
			// If the current page is in the middle range
			const firstPageItem = (
				<li
					className="storeengine-pagination-list__item"
					key={1}
					onClick={() => {
						handlePageChange(1);
					}}
					role="presentation"
				>
					{1}
				</li>
			);
			renderedPages.push(firstPageItem);
			renderedPages.push(
				<li
					className="storeengine-pagination-list__item storeengine-pagination-list__item-dots"
					key="dots-start"
				>
					...
				</li>
			);
			for (let i = page - 1; i <= page + 1; i++) {
				const pageItem = (
					<li
						className={`storeengine-pagination-list__item ${
							i === page && 'storeengine-pagination-list__item-active'
						}`}
						key={i}
						onClick={() => {
							handlePageChange(i);
						}}
						role="presentation"
					>
						{i}
					</li>
				);
				renderedPages.push(pageItem);
			}
			renderedPages.push(
				<li
					className="storeengine-pagination-list__item storeengine-pagination-list__item-dots"
					key="dots-end"
				>
					...
				</li>
			);
			const lastPageItem = (
				<li
					className="storeengine-pagination-list__item"
					key={totalPages}
					onClick={() => {
						handlePageChange(totalPages);
					}}
					role="presentation"
				>
					{totalPages}
				</li>
			);
			renderedPages.push(lastPageItem);
		}

		return renderedPages;
	};

	return (
		<div className="storeengine-pagination">
			{showPrevButton && (
				<>
					<Button
						icon={
							<span>
								<span className="storeengine-icon storeengine-icon--angle-left" />
								<span className="storeengine-icon storeengine-icon--angle-left" />
							</span>
						}
						onClick={() => {
							handlePageChange(1);
						}}
					/>
					<Button
						icon={
							<span className="storeengine-icon storeengine-icon--angle-left" />
						}
						onClick={() => {
							handlePageChange(page - 1);
						}}
					/>
				</>
			)}
			{pageNumbers.length > 1 && (
				<ul className="storeengine-pagination-list">
					{renderPageNumbers()}
				</ul>
			)}
			{showNextButton && (
				<>
					<Button
						icon={
							<span className="storeengine-icon storeengine-icon--angle-right" />
						}
						onClick={() => {
							handlePageChange(page + 1);
						}}
					/>
					<Button
						icon={
							<span>
								<span className="storeengine-icon storeengine-icon--angle-right" />
								<span className="storeengine-icon storeengine-icon--angle-right" />
							</span>
						}
						onClick={() => {
							handlePageChange(pageNumbers.length);
						}}
					/>
				</>
			)}
		</div>
	);
};

Pagination.propTypes = propTypes;
Pagination.defaultProps = defaultProps;
export default Pagination;
