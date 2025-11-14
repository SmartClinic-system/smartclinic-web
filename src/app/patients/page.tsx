"use client";

import { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Menu,
  MenuItem,
  IconButton,
  Card,
  Pagination,
} from "@mui/material";
import {
  Add,
  Search,
  ArrowDropDown,
  Visibility,
  Edit,
  AddTask,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import Sidebar from "@/components/Sidebar";

interface Patient {
  id: string;
  patientId: string;
  fullName: string;
  dateOfBirth: string;
  phoneNumber: string;
  lastVisit: string;
  status: "Active" | "Inactive";
}

const patients: Patient[] = [
  {
    id: "1",
    patientId: "P-10234",
    fullName: "Eleanor Vance",
    dateOfBirth: "1985-05-15",
    phoneNumber: "(555) 123-4567",
    lastVisit: "2023-10-22",
    status: "Active",
  },
  {
    id: "2",
    patientId: "P-10235",
    fullName: "Marcus Holloway",
    dateOfBirth: "1992-09-01",
    phoneNumber: "(555) 987-6543",
    lastVisit: "2023-11-05",
    status: "Active",
  },
  {
    id: "3",
    patientId: "P-10236",
    fullName: "Clara Oswald",
    dateOfBirth: "1988-11-23",
    phoneNumber: "(555) 246-8135",
    lastVisit: "2023-09-18",
    status: "Inactive",
  },
  {
    id: "4",
    patientId: "P-10237",
    fullName: "Arthur Pendragon",
    dateOfBirth: "1979-02-28",
    phoneNumber: "(555) 314-1592",
    lastVisit: "2023-11-12",
    status: "Active",
  },
  {
    id: "5",
    patientId: "P-10238",
    fullName: "Sarah Connor",
    dateOfBirth: "1990-07-14",
    phoneNumber: "(555) 555-0123",
    lastVisit: "2023-10-30",
    status: "Active",
  },
  {
    id: "6",
    patientId: "P-10239",
    fullName: "John Doe",
    dateOfBirth: "1985-03-20",
    phoneNumber: "(555) 444-5678",
    lastVisit: "2023-11-08",
    status: "Inactive",
  },
  {
    id: "7",
    patientId: "P-10240",
    fullName: "Jane Smith",
    dateOfBirth: "1995-12-05",
    phoneNumber: "(555) 333-9012",
    lastVisit: "2023-09-25",
    status: "Active",
  },
  {
    id: "8",
    patientId: "P-10241",
    fullName: "Michael Johnson",
    dateOfBirth: "1982-08-17",
    phoneNumber: "(555) 222-3456",
    lastVisit: "2023-11-15",
    status: "Active",
  },
  {
    id: "9",
    patientId: "P-10242",
    fullName: "Emily Davis",
    dateOfBirth: "1991-04-22",
    phoneNumber: "(555) 111-7890",
    lastVisit: "2023-10-10",
    status: "Inactive",
  },
  {
    id: "10",
    patientId: "P-10243",
    fullName: "David Wilson",
    dateOfBirth: "1987-11-30",
    phoneNumber: "(555) 999-2345",
    lastVisit: "2023-11-20",
    status: "Active",
  },
];

export default function PatientsPage() {
  const [searchValue, setSearchValue] = useState("");
  const [sortAnchor, setSortAnchor] = useState<null | HTMLElement>(null);
  const [statusAnchor, setStatusAnchor] = useState<null | HTMLElement>(null);
  const [sortBy, setSortBy] = useState("Last Name A-Z");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const filteredPatients = useMemo(() => {
    let filtered = [...patients];

    // Search filter
    if (searchValue) {
      const searchLower = searchValue.toLowerCase();
      filtered = filtered.filter(
        (patient) =>
          patient.fullName.toLowerCase().includes(searchLower) ||
          patient.patientId.toLowerCase().includes(searchLower) ||
          patient.phoneNumber.includes(searchValue)
      );
    }

    // Status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter(
        (patient) => patient.status === statusFilter
      );
    }

    // Sort
    if (sortBy === "Last Name A-Z") {
      filtered.sort((a, b) => {
        const aLast = a.fullName.split(" ").pop() || "";
        const bLast = b.fullName.split(" ").pop() || "";
        return aLast.localeCompare(bLast);
      });
    } else if (sortBy === "Last Name Z-A") {
      filtered.sort((a, b) => {
        const aLast = a.fullName.split(" ").pop() || "";
        const bLast = b.fullName.split(" ").pop() || "";
        return bLast.localeCompare(aLast);
      });
    }

    return filtered;
  }, [searchValue, sortBy, statusFilter]);

  const paginatedPatients = useMemo(() => {
    const start = page * pageSize;
    const end = start + pageSize;
    return filteredPatients.slice(start, end);
  }, [filteredPatients, page, pageSize]);

  const columns: GridColDef[] = [
    {
      field: "patientId",
      headerName: "Patient ID",
      width: 150,
      renderCell: (params) => (
        <Typography sx={{ fontFamily: "monospace", fontSize: "0.875rem" }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "fullName",
      headerName: "Full Name",
      width: 200,
      renderCell: (params) => (
        <Typography sx={{ fontWeight: 500, fontSize: "0.875rem" }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "dateOfBirth",
      headerName: "Date of Birth",
      width: 150,
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      width: 180,
    },
    {
      field: "lastVisit",
      headerName: "Last Visit",
      width: 150,
    },
    {
      field: "status",
      headerName: "Status",
      width: 140,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={params.value === "Active" ? "success" : "default"}
          sx={{
            fontWeight: 600,
            minWidth: 80,
          }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            size="small"
            sx={{
              color: "text.secondary",
              "&:hover": { backgroundColor: "action.hover" },
            }}
          >
            <Visibility sx={{ fontSize: 20 }} />
          </IconButton>
          <IconButton
            size="small"
            sx={{
              color: "text.secondary",
              "&:hover": { backgroundColor: "action.hover" },
            }}
          >
            <Edit sx={{ fontSize: 20 }} />
          </IconButton>
          <IconButton
            size="small"
            sx={{
              color: "success.main",
              "&:hover": { backgroundColor: "rgba(80, 227, 194, 0.1)" },
            }}
          >
            <AddTask sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          backgroundColor: "#F4F7FA",
        }}
      >
        <Box sx={{ flex: 1, overflow: "auto", p: 4 }}>
          <Box sx={{ maxWidth: "1280px", mx: "auto" }}>
            {/* Page Header */}
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

            {/* Action Bar */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { md: "center" },
                gap: 2,
                mb: 3,
              }}
            >
              {/* Search Bar */}
              <Box sx={{ flexGrow: 1 }}>
                <TextField
                  placeholder="Search by name, ID, or phone..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
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
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* Filter Chips */}
              <Box sx={{ display: "flex", gap: 1.5, overflowX: "auto" }}>
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

                <Button
                  variant="outlined"
                  endIcon={<ArrowDropDown />}
                  onClick={(e) => setStatusAnchor(e.currentTarget)}
                  sx={{
                    height: 48,
                    minWidth: 150,
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
                  Status: {statusFilter}
                </Button>
                <Menu
                  anchorEl={statusAnchor}
                  open={Boolean(statusAnchor)}
                  onClose={() => setStatusAnchor(null)}
                >
                  <MenuItem
                    onClick={() => {
                      setStatusFilter("All");
                      setStatusAnchor(null);
                    }}
                  >
                    All
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setStatusFilter("Active");
                      setStatusAnchor(null);
                    }}
                  >
                    Active
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setStatusFilter("Inactive");
                      setStatusAnchor(null);
                    }}
                  >
                    Inactive
                  </MenuItem>
                </Menu>
              </Box>
            </Box>

            {/* Data Grid */}
            <Card
              sx={{
                borderRadius: 3,
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

            {/* Pagination */}
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
                Showing{" "}
                <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
                  {page * pageSize + 1}-{Math.min((page + 1) * pageSize, filteredPatients.length)}
                </Box>{" "}
                of{" "}
                <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
                  {filteredPatients.length}
                </Box>{" "}
                patients
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
                  count={Math.ceil(filteredPatients.length / pageSize)}
                  page={page + 1}
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
                    setPage((p) =>
                      Math.min(
                        Math.ceil(filteredPatients.length / pageSize) - 1,
                        p + 1
                      )
                    )
                  }
                  disabled={page >= Math.ceil(filteredPatients.length / pageSize) - 1}
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
        </Box>
      </Box>
    </Box>
  );
}

