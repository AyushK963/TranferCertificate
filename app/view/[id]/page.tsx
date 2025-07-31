"use client"
import React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Trash, Edit, PrinterIcon as Print , Mail} from "lucide-react"
import Link from "next/link"
import { convertDateToWords } from "@/lib/utils"
import { useEffect, useState,useRef } from "react";
import { useReactToPrint } from "react-to-print";
// import { use } from "react";
import { useParams } from "next/navigation";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Image from "next/image"
import { useRouter } from "next/navigation"
import { formatDate } from "@/lib/utils"

export default function viewTC({params}:{params : {id:string}}) {

    const { id } = useParams();
    const [data, setData]= useState<any>(null);
    const [tc, setTC] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const contentRef = useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({ contentRef });
    const router = useRouter();

    const handleDelete = async () => {
        const confirmDelete = confirm("Are you sure you want to delete this Transfer Certificate?");
        if (!confirmDelete) return;

        try {
            const res = await fetch(`/api/delete?id=${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                alert("TC deleted successfully.");
                router.push("/"); // Go back to homepage or list
            } else {
                alert("Failed to delete the TC.");
            }
        } catch (error) {
            console.error("Error deleting TC:", error);
            alert("An error occurred.");
        }
    };

    useEffect(() => {
        async function fetchTC() {
            setLoading(true);
            console.log("Fetching TC for id:", id);
            try{
                const res = await fetch(`/api/view?id=${id}`);
                if (res.ok) {
                    const data = await res.json();
                    console.log("API response:", data);
                    setTC(data);
            }
            }catch(err){
                console.log(err);
                setTC(null);
            }
            setLoading(false);
        }
        if(id) fetchTC();
    }, [id]);

    // const sanitizeLabColors = (element: HTMLElement) => {
    //     const allElements = element.querySelectorAll("*");
    //     allElements.forEach((el) => {
    //       const style = getComputedStyle(el);
    //       if (style.color.includes("lab(")) {
    //         (el as HTMLElement).style.color = "#000";
    //       }
    //       if (style.backgroundColor.includes("lab(")) {
    //         (el as HTMLElement).style.backgroundColor = "#fff";
    //       }
    //     });
    // };

    const downloadPDF = async () => {
        const element = contentRef.current;
        if (!element) return;

        // sanitizeLabColors(element); 

        const canvas = await html2canvas(element, {
            scale: 2, // higher quality
            useCORS: true,
            windowWidth: element.scrollWidth,
            windowHeight: element.scrollHeight,
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgProps = {
            width: canvas.width,
            height: canvas.height,
        };

        const aspectRatio = imgProps.height / imgProps.width;
        const imageHeight = pdfWidth * aspectRatio;

        if (imageHeight > pdfHeight) {
            // Add page splitting if needed
            let position = 0;
            const pageHeightPx = (canvas.height * pdfWidth) / canvas.width;
            const pageHeightMm = pdfHeight;

            while (position < canvas.height) {
                const pageCanvas = document.createElement("canvas");
                pageCanvas.width = canvas.width;
                pageCanvas.height = Math.min(canvas.height - position, canvas.height);
          
                const ctx = pageCanvas.getContext("2d");
                if (!ctx) return;
          
                ctx.drawImage(canvas, 0, -position);
          
                const pageImgData = pageCanvas.toDataURL("image/png");
                const pageImageHeight = (pageCanvas.height * pdfWidth) / pageCanvas.width;
          
                if (position !== 0) pdf.addPage();
                pdf.addImage(pageImgData, "PNG", 0, 0, pdfWidth, pageImageHeight);
          
                position += pageCanvas.height;
              }
            } else {
              pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imageHeight);
        }
       
        pdf.save(`Transfer_Certificate_${id}.pdf`);

    };

    if (loading) return <div>Loading...</div>;
    if (!tc) return <div>TC not found</div>

    // const handleDownload = () => {
    // // In a real app, you'd generate and download a PDF
    //     console.log("Downloading TC...")
    // }

    return (

        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    </Link>
                    <div>
                    <h1 className="text-2xl font-bold text-gray-900">Transfer Certificate</h1>
                    <p className="text-gray-600">TC ID: {tc.tcId}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={reactToPrintFn}>
                    <Print className="w-4 h-4 mr-2" />
                    Print
                    </Button>
                    <Link href={`/edit/${id}`}>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                    </Button>
                    </Link>
                    <Button variant="destructive" onClick={handleDelete}>
                        <Trash className="w-4 h-4 mr-2" />
                            Delete
                    </Button>
                    {/* <Button variant="outline" onClick={downloadPDF}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                    </Button> */}
                </div>
                </div>
                <div ref={contentRef} className="print-area text-black">
                    {/* TC Document */}
                    <Card className="max-w-4xl mx-auto bg-white shadow-lg print:shadow-none w-full border-2 border-black">
                    <CardHeader className="text-center border-b">
                    <div className="w-full flex justify-center mb-2">
                        <div className="flex items-center gap-4">
                            <Image
                            src="/img.jpg"
                            alt="image"
                            width={90}
                            height={90}
                            className="rounded-full object-cover"
                            />

                            <div className="flex flex-col text-center">
                            <h2 className="text-3xl font-bold text-blue-800">
                                Shri Gandhi Inter College, Orai (Jalaun)
                            </h2>
                            <p className="text-lg">"शिक्षार्थ आइये, सेवार्थ जाइये"</p>
                            <p className="text-xl  font-bold text-black-600">
                                Station Road Orai Jalaun Uttar Pradesh
                            </p>
                            <p className=" text-xl  font-bold text-black-600">
                                www.sgicorai.com | Email: sgicorai@gmail.com
                            </p>
                            <p className=" text-xl  font-bold text-black-600">
                                UDISE:09351300212 | SchoolCode: 45-1032
                            </p>
                            </div>
                        </div>
                        </div>
                        <div>
                            <p className="text-xl text-center font-extrabold text-red-600">SCHOLAR REGISTER & TRANSFER CERTIFICATE</p>
                            <div className="flex justify-between items-center">
                            <p className="text-sm">
                                TC No: <span className="font-semibold">{tc.tcId}</span>
                            </p>
                            <p className="text-sm">
                                Date: <span className="font-semibold">{formatDate(tc.issueDate)}</span>
                            </p>
                            </div>
                        </div>
                    </CardHeader>


                    <CardContent className="p-4 space-y-1">
                        {/* Student Information */}
                        <div>
                        <h3 className="text-lg font-semibold mb-2 text-blue-700">Student Information</h3>
                        <div className="grid grid-cols-4 gap-4">
                            <div>
                            <p className="text-sm text-gray-600">Student Name</p>
                            <p className="font-semibold">{tc.studentName.toUpperCase()}</p>
                            <p className="font-semibold">{tc.studentNameHi}</p>
                            </div>
                            <div>
                            <p className="text-sm text-gray-600">SR Number</p>
                            <p className="font-semibold">{tc.rollNumber}</p>
                            </div>
                            <div>
                            <p className="text-sm text-gray-600">Father's Name</p>
                            <p className="font-semibold">{tc.fatherName.toUpperCase()}</p>
                            <p className="font-semibold">{tc.fatherNameHi}</p>
                            </div>
                            <div>
                            <p className="text-sm text-gray-600">Mother's Name</p>
                            <p className="font-semibold">{tc.motherName.toUpperCase()}</p>
                            <p className="font-semibold">{tc.motherNameHi}</p>
                            </div>
                            <div>
                            <p className="text-sm text-gray-600">Date of Birth</p>
                            <p className="font-semibold">{formatDate(tc.dateOfBirth)}</p>
                            </div>
                            <div>
                            <p className="text-sm text-gray-600">Religion</p>
                            <p className="font-semibold">{tc.religion}</p>
                            </div>
                            <div>
                            <p className="text-sm text-gray-600">Caste</p>
                            <p className="font-semibold">{tc.caste}</p>
                            </div>
                            <div>
                            <p className="text-sm text-gray-600">Gender</p>
                            <p className="font-semibold">{tc.gender}</p>
                            </div>
                        </div>
                        <div className=" grid grid-cols-4 mt-2 gap-4">
                            <div>
                            <p className="text-sm text-gray-600">Date of Birth in words</p>
                            <p className="font-semibold">({convertDateToWords(tc.dateOfBirth.split('-').reverse().join('/'))})</p>
                            </div>
                            <div>
                            <p className="text-sm text-gray-600" >Address</p>
                            <p className="font-semibold">{tc.address}</p>
                            </div>
                            <div>
                            <p className="text-sm text-gray-600" >PEN Number</p>
                            <p className="font-semibold">{tc.panNumber}</p>
                            </div>
                            <div>
                            <p className="text-sm text-gray-600" >Nationality</p>
                            <p className="font-semibold">{tc.nationality}</p>
                            </div>
                            </div>
                        </div>
                        {/* Academic Information */}
                        <div>
                        <h3 className="text-lg font-semibold mb-4 text-blue-700">Academic Information</h3>
                        <div className="grid grid-cols-4 gap-4">
                            <div>
                            <p className="text-sm text-gray-600">Date of Admission</p>
                            <p className="font-semibold">{formatDate(tc.dateOfAdmission)}</p>
                            </div>
                            <div>
                            <p className="text-sm text-gray-600">Date of Leaving</p>
                            <p className="font-semibold">{formatDate(tc.dateOfLeaving)}</p>
                            </div>
                            <div>
                            <p className="text-sm text-gray-600">Last Class Attended</p>
                            <p className="font-semibold">{tc.lastClassAttended}</p>
                            </div>
                            <div>
                            <p className="text-sm text-gray-600">Reason for Leaving</p>
                            <p className="font-semibold">{tc.reasonForLeaving}</p>
                            </div>
                        </div>
                        </div>

                        <Separator className="bg-black h-[1px]"/>

                        {/* School Information */}
                        <div>
                        <h3 className="text-lg font-semibold mb-4 text-blue-700">School Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                            <p className="text-sm text-gray-600">School Leaving From</p>
                            <p className="font-semibold">{tc.schoolLeavingFrom}</p>
                            </div>
                            <div>
                            <p className="text-sm text-gray-600">Last Instituion Attended</p>
                            <p className="font-semibold">{tc.schoolLeavingTo || "Not specified"}</p>
                            </div>
                        </div>
                        <Separator className="bg-black h-[1px] mt-1"/>

                        <div className="mt-6">
                            <h4 className="text-md font-semibold text-blue-700 mb-2">Admission & Promotion History</h4>
                            <div className="border border-gray-300 rounded-md overflow-hidden">
                                <div className="grid grid-cols-5 bg-gray-100 text-sm font-medium text-gray-700 p-2 m-1">
                                <div>Class</div>
                                <div>Admission Date</div>
                                <div>Promotion/Removal</div>
                                <div>Session</div>
                                <div>Conduct & Remark</div>
                                </div>
                                {Array.isArray(tc.admissionHistory) && tc.admissionHistory.map((entry, index) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-5 text-sm text-gray-800 border-t border-black p-2"
                                >
                                    <div>{entry.className}</div>
                                    <div>{formatDate(entry.admissionDate)}</div>
                                    <div>{formatDate(entry.promotionDate)}</div>
                                    <div>{entry.session}</div>
                                    <div>{entry.conduct}</div>
                                </div>
                                ))}
                            </div>
                        </div>
                        </div>

                        <Separator className="bg-black h-[1px]"/>
                        {/* {tc.remarks && (
                        <>
                            <Separator />
                            <div className="flex flex-row">
                                <h3 className="text-lg font-semibold mb-4 text-blue-700">Remarks: : </h3>
                                <p className="text-gray-700 text-center">{tc.remarks}</p>
                            </div>
                        </>
                        )} */}

                        {/* <div className="text-center text-xs text-gray-500 mt-8">
                        <p>This is a computer generated transfer certificate.</p>
                        <p>For any queries, please contact the school administration.</p>
                        </div> */}>
                    </CardContent>
                    <CardFooter className=" flex flex-col justify-center">
                        {/* Signature Section */}
                    <div className="flex justify-around items-end w-full gap-8">
                    <div className="text-center">
                        <div className="border-t border-gray-400 w-48 mb-2"></div>
                        <p className="text-sm text-gray-600">Counter Sign (Optional)</p>
                    </div>
                    <div className="text-center">
                        <div className="border-t border-gray-400 w-48 mb-2"></div>
                        <p className="text-sm text-gray-600">Prepared By</p>
                    </div>
                    <div className="text-center">
                        <div className="border-t border-gray-400 w-48 mb-2"></div>
                        <p className="text-sm text-gray-600">Principal</p>
                    </div>
                    </div>
                        <p className="text-center text-xs text-blue-700 font-extrabold">
                        @ Developed by Kankane Tech Contact us at : kankanetech@gmail.com
                        </p>
                    </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )

}
