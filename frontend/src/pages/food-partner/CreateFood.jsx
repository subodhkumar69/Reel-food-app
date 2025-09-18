import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import '../../styles/create-food.css';
import { useNavigate } from 'react-router-dom';

const CreateFood = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [videoURL, setVideoURL] = useState('');
    const [fileError, setFileError] = useState('');
    const [loading, setLoading] = useState(false); // 👈 new
    const fileInputRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (!videoFile) {
            setVideoURL('');
            return;
        }
        const url = URL.createObjectURL(videoFile);
        setVideoURL(url);
        return () => URL.revokeObjectURL(url);
    }, [videoFile]);

    const onFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) { setVideoFile(null); setFileError(''); return; }
        if (!file.type.startsWith('video/')) { setFileError('Please select a valid video file.'); return; }
        setFileError('');
        setVideoFile(file);
    };

    const onDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer?.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('video/')) { setFileError('Please drop a valid video file.'); return; }
        setFileError('');
        setVideoFile(file);
    };

    const onDragOver = (e) => {
        e.preventDefault();
    };

    const openFileDialog = () => fileInputRef.current?.click();

    const onSubmit = async (e) => {
        e.preventDefault();

        if (loading) return; // 👈 prevent duplicate submit
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append("video", videoFile);

            const response = await axios.post("http://localhost:3000/api/food", formData, {
                withCredentials: true,
            });

            console.log(response.data);
            navigate("/"); 
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false); // 👈 reset
        }
    };

    const isDisabled = useMemo(
        () => !name.trim() || !videoFile || loading,
        [name, videoFile, loading]
    );

    return (
        <div className="create-food-page">
            <div className="create-food-card">
                <header className="create-food-header">
                    <h1 className="create-food-title">Create Food</h1>
                    <p className="create-food-subtitle">Upload a short video, give it a name, and add a description.</p>
                </header>

                <form className="create-food-form" onSubmit={onSubmit}>
                    {/* File input & dropzone */}
                    <div className="field-group">
                        <label htmlFor="foodVideo">Food Video</label>
                        <input
                            id="foodVideo"
                            ref={fileInputRef}
                            className="file-input-hidden"
                            type="file"
                            accept="video/*"
                            onChange={onFileChange}
                        />
                        <div
                            className="file-dropzone"
                            role="button"
                            tabIndex={0}
                            onClick={openFileDialog}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openFileDialog(); } }}
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                        >
                            <div className="file-dropzone-inner">
                                <div className="file-dropzone-text">
                                    <strong>Tap to upload</strong> or drag and drop
                                </div>
                                <div className="file-hint">MP4, WebM, MOV • Up to ~100MB</div>
                            </div>
                        </div>

                        {fileError && <p className="error-text" role="alert">{fileError}</p>}
                    </div>

                    {videoURL && (
                        <div className="video-preview">
                            <video className="video-preview-el" src={videoURL} controls playsInline preload="metadata" />
                        </div>
                    )}

                    <div className="field-group">
                        <label htmlFor="foodName">Name</label>
                        <input
                            id="foodName"
                            type="text"
                            placeholder="e.g., Spicy Paneer Wrap"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="field-group">
                        <label htmlFor="foodDesc">Description</label>
                        <textarea
                            id="foodDesc"
                            rows={4}
                            placeholder="Write a short description: ingredients, taste, spice level, etc."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="form-actions">
                        <button className="btn-primary" type="submit" disabled={isDisabled}>
                            {loading ? "Saving..." : "Save Food"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateFood;
