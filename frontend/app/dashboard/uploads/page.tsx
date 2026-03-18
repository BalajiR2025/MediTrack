'use client'

import { useState, useCallback } from 'react'
import { Upload, File, FileText, Image, Download, Trash2, Eye, CloudUpload, X } from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'

interface FileItem {
  id: string
  name: string
  type: 'pdf' | 'image' | 'document'
  size: string
  uploadedBy: string
  uploadedAt: string
  patientId: string
  patientName: string
}

const demoFiles: FileItem[] = [
  {
    id: 'F001',
    name: 'Lab_Results_Dec2024.pdf',
    type: 'pdf',
    size: '2.4 MB',
    uploadedBy: 'Dr. James Wilson',
    uploadedAt: '2024-12-15',
    patientId: 'P001',
    patientName: 'John Smith',
  },
  {
    id: 'F002',
    name: 'XRay_Chest.jpg',
    type: 'image',
    size: '5.1 MB',
    uploadedBy: 'Emily Johnson',
    uploadedAt: '2024-12-14',
    patientId: 'P002',
    patientName: 'Emma Wilson',
  },
  {
    id: 'F003',
    name: 'Medical_History.pdf',
    type: 'pdf',
    size: '1.8 MB',
    uploadedBy: 'Dr. Lisa Anderson',
    uploadedAt: '2024-12-13',
    patientId: 'P003',
    patientName: 'Robert Johnson',
  },
  {
    id: 'F004',
    name: 'Prescription_Note.pdf',
    type: 'pdf',
    size: '0.5 MB',
    uploadedBy: 'Dr. James Wilson',
    uploadedAt: '2024-12-12',
    patientId: 'P001',
    patientName: 'John Smith',
  },
  {
    id: 'F005',
    name: 'MRI_Scan_Results.pdf',
    type: 'pdf',
    size: '8.2 MB',
    uploadedBy: 'Dr. Lisa Anderson',
    uploadedAt: '2024-12-10',
    patientId: 'P004',
    patientName: 'Sarah Davis',
  },
]

export default function UploadsPage() {
  const { user } = useAuth()
  const role = user?.role || 'patient'
  const [files, setFiles] = useState<FileItem[]>(demoFiles)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<FileItem | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    if (droppedFiles.length > 0) {
      simulateUpload(droppedFiles[0].name)
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (selectedFiles && selectedFiles.length > 0) {
      simulateUpload(selectedFiles[0].name)
    }
  }

  const simulateUpload = (fileName: string) => {
    setUploadProgress(0)
    
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null) return null
        if (prev >= 100) {
          clearInterval(interval)
          
          const newFile: FileItem = {
            id: `F${Date.now()}`,
            name: fileName,
            type: fileName.endsWith('.pdf') ? 'pdf' : fileName.match(/\.(jpg|jpeg|png|gif)$/i) ? 'image' : 'document',
            size: `${(Math.random() * 5 + 0.5).toFixed(1)} MB`,
            uploadedBy: user?.name || 'Unknown',
            uploadedAt: new Date().toISOString().split('T')[0],
            patientId: 'P001',
            patientName: 'John Smith',
          }
          
          setFiles((prev) => [newFile, ...prev])
          toast.success('File uploaded successfully')
          setUploadProgress(null)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleDelete = (file: FileItem) => {
    setFiles((prev) => prev.filter((f) => f.id !== file.id))
    toast.success('File deleted successfully')
    setDeleteDialog(null)
  }

  const getFileIcon = (type: FileItem['type']) => {
    switch (type) {
      case 'pdf':
        return <FileText className="size-5 text-destructive" />
      case 'image':
        return <Image className="size-5 text-primary" />
      default:
        return <File className="size-5 text-muted-foreground" />
    }
  }

  // Filter files for patients
  const displayedFiles = role === 'patient' 
    ? files.filter((f) => f.patientId === 'P001') 
    : files

  return (
    <div className="flex flex-1 flex-col">
      <DashboardHeader
        title="File Uploads"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: role === 'patient' ? 'Downloads' : 'Uploads' },
        ]}
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {role === 'patient' ? 'My Documents' : 'File Management'}
          </h1>
          <p className="text-muted-foreground">
            {role === 'patient' 
              ? 'View and download your medical documents'
              : 'Upload, manage, and organize patient documents'}
          </p>
        </div>

        {/* Upload Area - Only for staff/doctors */}
        {role !== 'patient' && (
          <Card>
            <CardHeader>
              <CardTitle>Upload Documents</CardTitle>
              <CardDescription>
                Drag and drop files or click to browse. Supported formats: PDF, JPG, PNG
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors ${
                  isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-muted-foreground/25 hover:border-primary/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  className="absolute inset-0 cursor-pointer opacity-0"
                  onChange={handleFileSelect}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <CloudUpload className="size-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">
                  {isDragging ? 'Drop files here' : 'Drag & drop files'}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  or click to browse from your computer
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Maximum file size: 10MB
                </p>
              </div>

              {/* Upload Progress */}
              {uploadProgress !== null && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Files Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              {role === 'patient' ? 'Your Documents' : 'Uploaded Files'}
            </CardTitle>
            <CardDescription>{displayedFiles.length} files total</CardDescription>
          </CardHeader>
          <CardContent>
            {displayedFiles.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File</TableHead>
                    {role !== 'patient' && <TableHead>Patient</TableHead>}
                    <TableHead className="hidden md:table-cell">Uploaded By</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead className="hidden sm:table-cell">Size</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedFiles.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {getFileIcon(file.type)}
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <Badge variant="outline" className="mt-1 text-xs">
                              {file.type.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      {role !== 'patient' && (
                        <TableCell>
                          <div>
                            <p className="font-medium">{file.patientName}</p>
                            <p className="text-xs text-muted-foreground">{file.patientId}</p>
                          </div>
                        </TableCell>
                      )}
                      <TableCell className="hidden md:table-cell">
                        {file.uploadedBy}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {file.uploadedAt}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {file.size}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => toast.info('Preview feature coming soon')}>
                            <Eye className="size-4" />
                            <span className="sr-only">Preview</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => toast.success('Download started')}>
                            <Download className="size-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                          {role !== 'patient' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setDeleteDialog(file)}
                            >
                              <Trash2 className="size-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <File className="size-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">No files yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {role === 'patient' 
                    ? 'Your documents will appear here'
                    : 'Upload your first document to get started'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete File</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{deleteDialog?.name}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => deleteDialog && handleDelete(deleteDialog)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
