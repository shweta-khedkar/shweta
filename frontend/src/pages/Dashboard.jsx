import React, { useEffect, useState } from 'react';
import {
    Container, Typography, Box, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Button, Chip,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [consents, setConsents] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [newAppId, setNewAppId] = useState('');
    const [newDataCategory, setNewDataCategory] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchConsents();
    }, []);

    const fetchConsents = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            const response = await axios.get('http://localhost:5000/api/consents', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setConsents(response.data);
        } catch (error) {
            console.error('Error fetching consents:', error);
            if (error.response?.status === 401) navigate('/login');
        }
    };

    const handleRevoke = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/consents/${id}/revoke`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchConsents();
        } catch (error) {
            console.error('Error revoking consent:', error);
        }
    };

    const handleGrantConsent = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/consents', {
                appId: newAppId,
                dataCategories: [newDataCategory]
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOpenDialog(false);
            setNewAppId('');
            setNewDataCategory('');
            fetchConsents();
        } catch (error) {
            console.error('Error granting consent:', error);
        }
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">My Consents</Typography>
                <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
                    Grant New Consent
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>App ID</TableCell>
                            <TableCell>Categories</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Expires At</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {consents.map((consent) => (
                            <TableRow key={consent._id}>
                                <TableCell>{consent.appId}</TableCell>
                                <TableCell>{consent.dataCategories.join(', ')}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={consent.status}
                                        color={consent.status === 'active' ? 'success' : 'error'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>{new Date(consent.expiresAt).toLocaleDateString()}</TableCell>
                                <TableCell align="right">
                                    {consent.status === 'active' && (
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            onClick={() => handleRevoke(consent._id)}
                                        >
                                            Revoke
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {consents.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">No consents found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Grant Consent Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Grant New Consent</DialogTitle>
                <DialogContent sx={{ minWidth: 400 }}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Application</InputLabel>
                        <Select
                            value={newAppId}
                            label="Application"
                            onChange={(e) => setNewAppId(e.target.value)}
                        >
                            <MenuItem value="Fitbit">Fitbit</MenuItem>
                            <MenuItem value="Spotify">Spotify</MenuItem>
                            <MenuItem value="MyFitnessPal">MyFitnessPal</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Data Category</InputLabel>
                        <Select
                            value={newDataCategory}
                            label="Data Category"
                            onChange={(e) => setNewDataCategory(e.target.value)}
                        >
                            <MenuItem value="location">Location</MenuItem>
                            <MenuItem value="steps">Steps</MenuItem>
                            <MenuItem value="heart_rate">Heart Rate</MenuItem>
                            <MenuItem value="playlist">Playlist Data</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleGrantConsent} variant="contained" color="primary">Grant</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Dashboard;
