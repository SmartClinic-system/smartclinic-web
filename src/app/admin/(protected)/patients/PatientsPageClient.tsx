"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Card,
  Pagination,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Add,
  Search,
  ArrowDropDown,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";

interface PatientRow {
  id: string;
  fullName: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
}

interface PatientsPageClientProps {
  patients: PatientRow[];
}

export default function PatientsPageClient({
  patients,
}: PatientsPageClientProps) {
  const [searchValue, setSearchValue] = useState("");
  const [sortAnchor, setSortAnchor] = useState<null | HTMLElement>(null);
  const [sortBy, setSortBy] = useState("Last Name A-Z");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const filteredPatients = useMemo(() => {
    let filtered = [...patients];

    if (searchValue) {
      const searchLower = searchValue.toLowerCase();
      filtered = filtered.filter(
        (patient) =>
          patient.fullName.toLowerCase().includes(searchLower) ||
          patient.email.toLowerCase().includes(searchLower) ||
          patient.phoneNumber.includes(searchValue)
      );
    }

    if (sortBy === "Last Name A-Z") {
      filtered.sort((a, b) => {
        const aLast = a.fullName.split(" ").pop() ?? "";
        const bLast = b.fullName.split(" ").pop() ?? "";
        return aLast.localeCompare(bLast);
      });
    } else if (sortBy === "Last Name Z-A") {
      filtered.sort((a, b) => {
        const aLast = a.fullName.split(" ").pop() ?? "";
        const bLast = b.fullName.split(" ").pop() ?? "";
        return bLast.localeCompare(aLast);
      });
    }

    return filtered;
  }, [patients, searchValue, sortBy]);

  const paginatedPatients = useMemo(() => {
    const start = page * pageSize;
    const end = start + pageSize;
    return filteredPatients.slice(start, end);
  }, [filteredPatients, page, pageSize]);

  const columns: GridColDef[] = [
    {
      field: "fullName",
      headerName: "Full Name",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Typography sx={{ fontWeight: 500, fontSize: "0.9rem" }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "dateOfBirth",
      headerName: "Date of Birth",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 220,
    },
  ];

  const totalPages = Math.max(1, Math.ceil(filteredPatients.length / pageSize));

  return (
    <Box sx={{ maxWidth: "1280px", mx: "auto" }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          mb: 3,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontSize: "2.25rem",
            fontWeight: 900,
            lineHeight: 1.2,
            letterSpacing: "-0.033em",
          }}
        >
          Patient Records
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{
            textTransform: "none",
            fontSize: "0.875rem",
            fontWeight: 700,
            px: 2.5,
            py: 1.5,
          }}
        >
          Add New Patient
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { md: "center" },
          gap: 2,
          mb: 3,
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <TextField
            placeholder="Search by name, email, or phone..."
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setPage(0);
            }}
            fullWidth
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                height: 48,
                backgroundColor: "background.paper",
                "& fieldset": {
                  borderColor: "divider",
                },
                "&:hover fieldset": {
                  borderColor: "divider",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "primary.main",
                  borderWidth: 2,
                },
              },
              "& .MuiInputBase-input": {
                fontSize: "1rem",
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        <Button
          variant="outlined"
          endIcon={<ArrowDropDown />}
          onClick={(e) => setSortAnchor(e.currentTarget)}
          sx={{
            height: 48,
            minWidth: 200,
            textTransform: "none",
            fontSize: "0.875rem",
            fontWeight: 500,
            borderColor: "divider",
            backgroundColor: "background.paper",
            "&:hover": {
              backgroundColor: "action.hover",
              borderColor: "divider",
            },
          }}
        >
          Sort by: {sortBy}
        </Button>
        <Menu
          anchorEl={sortAnchor}
          open={Boolean(sortAnchor)}
          onClose={() => setSortAnchor(null)}
        >
          <MenuItem
            onClick={() => {
              setSortBy("Last Name A-Z");
              setSortAnchor(null);
            }}
          >
            Last Name A-Z
          </MenuItem>
          <MenuItem
            onClick={() => {
              setSortBy("Last Name Z-A");
              setSortAnchor(null);
            }}
          >
            Last Name Z-A
          </MenuItem>
        </Menu>
      </Box>

      <Card
        sx={{
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        <DataGrid
          rows={paginatedPatients}
          columns={columns}
          disableColumnMenu
          disableRowSelectionOnClick
          hideFooter
          sx={{
            border: "none",
            "& .MuiDataGrid-cell": {
              borderColor: "divider",
              fontSize: "0.875rem",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "action.hover",
              borderBottom: "1px solid",
              borderColor: "divider",
              "& .MuiDataGrid-columnHeader": {
                borderColor: "divider",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "text.secondary",
              },
            },
            "& .MuiDataGrid-row": {
              "&:hover": {
                backgroundColor: "action.hover",
              },
            },
          }}
        />
      </Card>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { sm: "center" },
          justifyContent: "space-between",
          mt: 3,
          px: 1,
          gap: 2,
        }}
      >
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", fontSize: "0.875rem" }}
        >
          Showing {filteredPatients.length === 0 ? 0 : page * pageSize + 1}-
          {Math.min((page + 1) * pageSize, filteredPatients.length)} of{" "}
          {filteredPatients.length} patients
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<ChevronLeft />}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            sx={{
              textTransform: "none",
              fontSize: "0.875rem",
              fontWeight: 500,
              borderColor: "divider",
              backgroundColor: "background.paper",
              "&:hover": {
                backgroundColor: "action.hover",
                borderColor: "divider",
              },
            }}
          >
            Previous
          </Button>
          <Pagination
            count={totalPages}
            page={Math.min(page + 1, totalPages)}
            onChange={(_, value) => setPage(value - 1)}
            color="primary"
            shape="rounded"
            sx={{
              "& .MuiPaginationItem-root": {
                fontSize: "0.875rem",
                fontWeight: 500,
                minWidth: 36,
                height: 36,
                "&.Mui-selected": {
                  backgroundColor: "primary.main",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                },
              },
            }}
          />
          <Button
            variant="outlined"
            endIcon={<ChevronRight />}
            onClick={() =>
              setPage((p) => Math.min(Math.max(0, totalPages - 1), p + 1))
            }
            disabled={page >= totalPages - 1}
            sx={{
              textTransform: "none",
              fontSize: "0.875rem",
              fontWeight: 500,
              borderColor: "divider",
              backgroundColor: "background.paper",
              "&:hover": {
                backgroundColor: "action.hover",
                borderColor: "divider",
              },
            }}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
