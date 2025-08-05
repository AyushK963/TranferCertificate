'use client'

import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Edit,
  Eye,
  FileText,
  Plus,
  Search,
} from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useRouter } from "next/navigation";
type tc = {
  id: string
  tcId: string
  studentName: string
  rollNumber: string
  class: string
  issueDate: string
  reasonForLeaving: string
}

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredTCs, setFilteredTCs] = useState<tc[]>([])
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Adjust per your design
  const totalPages = Math.ceil(filteredTCs.length / itemsPerPage);
  const [tc, setTc] = useState<tc[]>([])
  const router = useRouter();



const paginatedTCs = Array.isArray(filteredTCs)
  ? filteredTCs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  : [];


// Reset to first page on new search
useEffect(() => {
  setCurrentPage(1);
}, [searchTerm]);

  const handleLogout = () => {
    // Delete the cookie manually
    document.cookie = "auth=; Max-Age=0; path=/";
    router.push("/login");
  };

  useEffect(() => {
  const fetchTc = async () => {
  try {
    const response = await fetch("/api/tc");
    const data = await response.json();

    console.log("Fetched TC data:", data); // ✅ Add this line

    if (Array.isArray(data)) {
      setTc(data);
      setFilteredTCs(data);
    } else {
      console.error("Expected array but got:", data);
      setTc([]); // Set to empty array to avoid breaking UI
      setFilteredTCs([]);
    }
  } catch (error) {
    console.error("Error fetching TCs:", error);
    setTc([]);
    setFilteredTCs([]);
  }
  };
  fetchTc();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);

    const filtered = Array.isArray(tc)
      ? tc.filter((tc) =>
          tc.studentName.toLowerCase().includes(value.toLowerCase()) ||
          tc.rollNumber.toLowerCase().includes(value.toLowerCase()) ||
          tc.tcId.toLowerCase().includes(value.toLowerCase())
        )
      : [];

    setFilteredTCs(filtered);
  };


const getTCsThisMonth = () => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  return Array.isArray(tc)
    ? tc.filter((tc) => {
        const date = new Date(tc.issueDate);
        return (
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear
        );
      }).length
    : 0;
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">

        {/* Header Centered */}
        <div className="bg-indigo-100 p-4">
          <Header/>
        </div>

        {/* Search and Create */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
          <div className="relative w-full sm:flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by name, Sr number, or  TC ID"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 bg-white shadow-sm border-gray-300"
            />
          </div>
          <Link href="/create">
            <Button className="bg-blue-600 hover:bg-green-700 w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Create New TC
            </Button>
          </Link>
          <Button
            onClick={handleLogout}
            className="bg-blue-600 hover:bg-red-600  w-full sm:w-auto">
              Logout
            </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total TCs</CardTitle>
              <FileText className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tc.length}</div>
              <p className="text-xs text-gray-500">All time</p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <FileText className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTCsThisMonth()}</div>
              <p className="text-xs text-gray-500">
                Issued in {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedTCs.map((tc) => (
            <Card key={tc.tcId} className="hover:shadow-lg transition-all bg-white border border-gray-200">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-semibold">{tc.studentName}</CardTitle>
                    <CardDescription className="text-xs text-gray-500">TC ID: {tc.tcId}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm text-gray-700 mb-4">
                  <p><span className="font-medium">SR No:</span> {tc.rollNumber}</p>
                  <p><span className="font-medium">Issue Date:</span> {tc.issueDate}</p>
                  <p><span className="font-medium">Reason:</span> {tc.reasonForLeaving}</p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/view/${tc.tcId}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full hover:bg-green-500">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </Link>
                  <Link href={`/edit/${tc.tcId}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full hover:bg-green-500">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>


        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 gap-4">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className='hover:bg-green-300'
            >
              Previous
            </Button>
            <span className="text-sm font-medium text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className='hover:bg-green-300'
            >
              Next
            </Button>
          </div>
        )}





        {/* No Results */}
        {filteredTCs.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-10 h-10 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800">No transfer certificates found</h3>
            <p className="text-sm text-gray-600 mb-4">
              {searchTerm ? "Try adjusting your search terms." : "Get started by creating your first TC."}
            </p>
            {!searchTerm && (
              <Link href="/create">
                <Button className="mx-auto hover:bg-green-700 ">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New TC
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
