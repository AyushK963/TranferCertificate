"use client";

import React, { use, useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card, CardHeader, CardTitle, CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select, SelectTrigger, SelectValue,
  SelectContent, SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Trash, Plus } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/header";

// Zod schemas
const admissionEntrySchema = z.object({
  className: z.string().min(1),
  admissionDate:z.string().min(1),
  promotionDate:z.string().min(1),
  session: z.string().min(1),
  conduct: z.string().min(1),
});
const tcSchema = z.object({
  studentName: z.string().min(1),
  studentNameHi: z.string().min(1),
  fatherName: z.string().min(1),
  fatherNameHi: z.string().min(1),
  motherName: z.string().min(1),
  motherNameHi: z.string().min(1),
  religion: z.string().optional(),
  caste: z.string().optional(),
  rollNumber: z.string().min(1),
  dateOfBirth: z.string().min(1),
  gender:z.string().min(1),
  address:z.string().min(1),
  panNumber:z.string().min(10).max(10),
  nationality:z.string().min(1).max(10),
  addharCard:z.string().min(12).max(12),

  dateOfAdmission: z.string().min(1),
  dateOfLeaving: z.string().min(1),
  reasonForLeaving: z.string().min(1),
  lastClassAttended: z.string().optional(),


  schoolLeavingFrom: z.string().min(1),
  schoolLeavingTo: z.string().optional(),

  admissionHistory: z.array(admissionEntrySchema),
});
type TCFormType = z.infer<typeof tcSchema>;



export default function EditTC({ params }: { params: { id: string } }) {
  const { id:tcId } = use(params);
  console.log(tcId);
  const router = useRouter();

  const [fetchedValues, setFetchedValues] = useState<TCFormType | null>(null);
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/tc/${tcId}`);
        const data = await res.json();
        setFetchedValues(data);
      } catch (error) {
        console.error("Failed to fetch TC:", error);
      }
    }
    fetchData();
  }, [tcId]);


  const form = useForm<TCFormType>({    
    resolver: zodResolver(tcSchema),
    defaultValues: useMemo(() => fetchedValues ?? undefined, [fetchedValues]),
  });

  useEffect(() => {
    if (fetchedValues) {
      form.reset(fetchedValues);
    }
  }, [fetchedValues, form]);

  const { register, control, handleSubmit, setValue, getValues } = form;
  const { fields, append, remove } = useFieldArray({ name: "admissionHistory", control });

  const onSubmit = async (data: TCFormType) => {

    try {
      const res = await fetch(`/api/edit/${tcId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error(`Failed to update: ${res.status}`);
      }
      router.push(`/view/${tcId}`);
      
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to save changes.");
      
    }
  };

  if (!fetchedValues) {
    return <div className="text-center py-10 text-gray-500">Loading form...</div>;
  }

  // Custom submit handler to show Sonner toast on error
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(
      async (data) => {
        await onSubmit(data);
      },
      (errors) => {
        toast.error("Please fill all required fields before submitting.");
      }
    )(e);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
          <div className="w-full">
            <Header/>
          </div>
        <div className="flex justify-center items-center gap-4 mb-8 mt-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Transfer Certificate</h1>
            <p className="text-gray-600 justify-center items-center">TC ID: {tcId}</p>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-8">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {([
                { label: "Student Name (English)", name: "studentName" },
                { label: "Student Name (Hindi)", name: "studentNameHi" },
                { label: "Father Name (English)", name: "fatherName" },
                { label: "Father Name (Hindi)", name: "fatherNameHi" },
                { label: "Mother Name (English)", name: "motherName" },
                { label: "Mother Name (Hindi)", name: "motherNameHi" },
                { label: "SR Number", name: "rollNumber" },
                { label: "Student Aadhar", name: "addharCard" },
                { label: "Date of Birth", name: "dateOfBirth", type: "date" },
                { label: " Student PEN ", name: "panNumber" },
                { label: "Address", name: "address" },
                { label: "Caste", name: "caste" },
              ] as const).map(({ label, name, type }) => (
                <div key={name} className="space-y-2">
                  <Label htmlFor={name}>{label} *</Label>
                  <Input
                    id={name}
                    type={type || "text"}
                    {...register(name as keyof TCFormType)}
                  />
                </div>
              ))}
              {/* Gender dropdown */}
              <Controller
                control={control}
                name="gender"
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label>Gender *</Label>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Male", "Female", "Transgender"].map(g => (
                          <SelectItem key={g} value={g}>{g}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />

              {/* Religion dropdown */}
              <Controller
                control={control}
                name="religion"
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label>Religion *</Label>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select religion" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Hindu", "Muslim", "Christian", "Sikh", "Buddhist", "Jain", "Other"].map(r => (
                          <SelectItem key={r} value={r}>{r}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
              <Controller
                control={control}
                name="nationality"
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label>Gender *</Label>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Nationality" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Indian"].map(g => (
                          <SelectItem key={g} value={g}>{g}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
            </CardContent>
          </Card>
          {/* Academic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Academic Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(["dateOfAdmission","dateOfLeaving","lastClassAttended","reasonForLeaving"] as (keyof TCFormType)[]).map(field => (
                <div key={field} className="space-y-2">
                  <Label>
                    {field === "reasonForLeaving"
                      ? "Reason for Leaving *"
                      : field === "lastClassAttended"
                      ? "Last Class Attended"
                      : field === "dateOfAdmission"
                      ? "Date of Admission *"
                      : "Date of Leaving *"}
                  </Label>

                  {field === "reasonForLeaving" ? (
                    <Controller
                      control={control}
                      name={field}
                      render={({ field: controllerField }) => (
                        <Select
                          value={controllerField.value || ""}
                          onValueChange={controllerField.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select reason" />
                          </SelectTrigger>
                          <SelectContent>
                            {["Family relocation", "Higher studies", "Parent transfer", "Financial reasons", "Other"].map(v => (
                              <SelectItem key={v} value={v}>{v}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  ) : (
                    <Input
                      id={field}
                      type={
                        field === "dateOfAdmission" || field === "dateOfLeaving"
                          ? "date"
                          : "text"
                      }
                      {...register(field)}
                    />
                  )}
                </div>
              ))}

            </CardContent>
          </Card>

          {/* School Info */}
          <Card>
            <CardHeader>
              <CardTitle>School Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Controller
                control={control}
                name="schoolLeavingFrom"
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label>School Leaving From *</Label>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select school" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Shri Gandhi Inter College Orai">Shri Gandhi Inter College Orai</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
              {/* Regular Input for schoolLeavingTo */}
              <div className="space-y-2">
                <Label>School Leaving To</Label>
                <Input type="text" {...register("schoolLeavingTo")} />
              </div>
              {/* Admission History */}
              <div className="md:col-span-2">
                <Label className="text-base">Admission & Promotion History</Label>
                {fields.map((item, idx) => (
                  <div key={item.id} className="grid md:grid-cols-4 gap-4 items-end mb-4">
                    <Input placeholder="Class" {...register(`admissionHistory.${idx}.className`)} />
                    <Input type="date" placeholder="Admission Date " {...register(`admissionHistory.${idx}.admissionDate`)} />
                    <Input type="date" placeholder="Promotion/Removal Date" {...register(`admissionHistory.${idx}.promotionDate`)} />
                    <Input placeholder="Session" {...register(`admissionHistory.${idx}.session`)} />
                    <Input placeholder="Conduct" {...register(`admissionHistory.${idx}.conduct`)} />
                    {idx > 0 && (
                      <Button type="button" variant="destructive" size="sm" onClick={() => remove(idx)}>
                        <Trash className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() =>
                  append({ className: "", admissionDate:"",promotionDate: "", session: "", conduct: "" })
                }>
                  <Plus className="w-4 h-4 mr-2" /> Add Promotion
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Link href={`/view/${tcId}`}>
              <Button variant="outline" className=" hover:bg-red-500">Cancel</Button>
            </Link>
            <Button type="submit" className="bg-blue-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" /> Update Tranfer Certificates
            </Button>
          </div>
        </form>
      </div>
      <Toaster />
    </div>
  );
}
