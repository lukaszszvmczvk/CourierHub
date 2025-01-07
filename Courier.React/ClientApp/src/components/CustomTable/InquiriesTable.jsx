﻿import React, { useMemo, useState, useEffect } from 'react';
import { useTable, useSortBy, useFilters } from 'react-table';
import { COLUMNS_INQUIRIES } from './columnsInquiriesTable'
import './table.css';
import { useAuth0 } from "@auth0/auth0-react";

export const InquiriesTable = () => {
    const columns = useMemo(() => COLUMNS_INQUIRIES, []);

    const { user } = useAuth0();
    const { getIdTokenClaims } = useAuth0();

    const [data, setInquiries] = useState([]);
    useEffect(() => {
        const fetchInquiryData = async () => {
            const claims = await getIdTokenClaims();
            const id_token = claims.__raw;
            const authUserId = user?.sub;
            fetch(`/api2/inquiry/${authUserId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${id_token}`,
                }
            })
                .then((result) => result.json())
                .then(data => setInquiries(data))
        }
        const fetchAdminInquiryData = async () => {
            const claims = await getIdTokenClaims();
            const id_token = claims.__raw;
            fetch('/api2/inquiry', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${id_token}`,
                }
            })
                .then((result) => result.json())
                .then(data => setInquiries(data))
        }

        if (user?.role[0] == 'Admin') {
            fetchAdminInquiryData()
                .catch((error) => console.error('Error fetching inquiries:', error));
        }
        else {
            fetchInquiryData()
                .catch((error) => console.error('Error fetching inquiries:', error));
        }
    }, [])

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        footerGroups,
        rows,
        prepareRow
    } = useTable(
        {
            columns,
            data
        },
        useFilters,
        useSortBy,
        )

    return (
        <>
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th>
                                    <div {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        {column.render('Header')}
                                        <span>
                                            {column.isSorted
                                                ? column.isSortedDesc
                                                    ? ' 🔽'
                                                    : ' 🔼'
                                                : ''}
                                        </span>
                                    </div>
                                    <div>{ column.canFilter ? column.render('Filter') : null}</div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map(row => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                })}
                            {/*   <td><button>Klik</button></td>*/}
                            </tr>
                        )
                    })}
                </tbody>
                <tfoot>
                    {footerGroups.map(footerGroup => (
                        <tr {...footerGroup.getFooterGroupProps()}>
                            {footerGroup.headers.map(column => (
                                <td {...column.getFooterProps()}>{column.render('Footer')}</td>
                            ))}
                        </tr>
                    ))}
                </tfoot>
            </table>
        </>
    )
}