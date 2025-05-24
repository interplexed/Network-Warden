import React from "react";

export default function PaginationControls({ page, totalPages, setPage }) {

  return (
    <div className="toolbar-section">
      <h5>Table Pagination</h5>
      <div className="flex-wrap-gap">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page <= 1}
          className={`btn-toolbar ${page <= 1 ? "btn-disabled" : ""}`}
        >
          Prev
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages}
          className={`btn-toolbar ${page >= totalPages ? "btn-disabled" : ""}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}