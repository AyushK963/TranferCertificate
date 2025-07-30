"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import Header from "@/components/header"

const admissionSchema = z.object({
  className: z.string().min(1, "Class name is required"),
  admissionDate : z.string().min(1, "Admission Date is required"),
  promotionDate:   z.string().min(1, "Promotion Date is required"),
  session: z.string().min(1, "Session is required"),
  conduct: z.string().min(1, { message: "This field is required" }),
})

const formSchema = z.object({
  tcId: z.string().min(1)  .refine((val) => !val.includes("/"), {
    message: "TC ID cannot contain '/' character",
  }),
  studentName: z.string().min(1),
  studentNameHi: z.string().min(1),
  fatherName: z.string().min(1),
  fatherNameHi:z.string().min(1),
  motherName: z.string().min(1),
  motherNameHi:z.string().min(1),
  religion: z.string().min(1),
  caste: z.string().min(1, { message: "This field is required" }),
  rollNumber: z.string().min(1),
  dateOfBirth: z.string().min(1),
  gender: z.string().min(1,{ message: "This field is required" }),
  address:z.string().min(10,{ message: "This field is required" }),
  panNumber:z.string().min(10,{message:"This field is required"}),
  nationality:z.string().min(1, {message:"This field is required"}),

  dateOfAdmission: z.string().min(1),
  dateOfLeaving: z.string().min(1),
  reasonForLeaving: z.string().min(1),
  lastClassAttended: z.string().min(1, { message: "This field is required" }),

  schoolLeavingFrom: z.string().min(1),
  schoolLeavingTo: z.string().min(1, { message: "This field is required" }),
  issueDate: z.string().min(1),
  
  admissionHistory: z.array(admissionSchema),
})

type FormData = z.infer<typeof formSchema>

export default function CreateTC() {
  const router = useRouter()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tcId: "",
      studentName: "",
      studentNameHi:"",
      fatherName: "",
      fatherNameHi:"",
      motherName: "",
      motherNameHi:"",
      religion: "",
      caste: "",
      rollNumber: "",
      dateOfBirth: "",
      gender:"",
      address:"",
      panNumber:"",
      nationality:"",

      dateOfAdmission: "",
      dateOfLeaving: "",
      lastClassAttended: "",
      reasonForLeaving: "",

      schoolLeavingFrom: "",
      schoolLeavingTo: "",
      issueDate: new Date().toISOString().split("T")[0],
      admissionHistory: [
        { className: "",admissionDate:"",promotionDate:"" , session: "", conduct: "" },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "admissionHistory",
  })

  const onSubmit = async (data: FormData) => {
    try {
      console.log("Form Subimmitted",data);
      const res = await fetch("/api/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await res.json()
      if (result.success) {
        alert("Transfer Certificate Saved!")
        router.push("/")
      } else {
        alert("Error: " + result.error)
      }
    } catch (err) {
      console.error(err)
      alert("Something went wrong")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-full">
            <Header/>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Student's personal and academic details</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  ["tcId", "TC ID *"],
                  ["studentName", "Student Name *"],
                  ["studentNameHi", "Student Name Hindi *"],
                  ["fatherName", "Father's Name *"],
                  ["fatherNameHi", "Father's Name Hindi *"],
                  ["motherName", "Mother's Name *"],
                  ["motherNameHi", "Mother's Name Hindi *"],
                  ["rollNumber", "SR Number *"],
                  ["dateOfBirth", "Date of Birth *", "date"],
                  ["panNumber", "PEN Number*"],
                ].map(([name, label, type = "text"]) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name as keyof FormData}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                          <Input type={type} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {["Male", "Female", "Transgender"].map((g) => (
                            <SelectItem key={g} value={g}>{g}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="religion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Religion *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select religion" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {["Hindu", "Muslim", "Christian", "Sikh", "Buddhist", "Jain", "Other"].map((r) => (
                            <SelectItem key={r} value={r}>{r}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                    control={form.control}
                    name="caste"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Caste *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select caste" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {["General", "SC", "ST", "OBC"].map((c) => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                />
                <FormField
                  control={form.control}
                  name="nationality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nationality *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select nationality" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {["Indian"].map((g) => (
                            <SelectItem key={g} value={g}>{g}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                />
              </CardContent>
            </Card>

            {/* Academic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Academic Information</CardTitle>
                <CardDescription>Class and academic details</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[ "dateOfAdmission", "dateOfLeaving", "lastClassAttended"].map((name) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name as keyof FormData}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{name.replace(/([A-Z])/g, " $1")}</FormLabel>
                        <FormControl>
                          <Input type={name.includes("date") ? "date" : "text"} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <FormField
                  control={form.control}
                  name="reasonForLeaving"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason for Leaving *</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select reason" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {["Family relocation", "Higher studies", "Parent transfer", "Financial reasons", "Other"].map((r) => (
                            <SelectItem key={r} value={r}>{r}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* School Info */}
            <Card>
              <CardHeader>
                <CardTitle>School Information</CardTitle>
                <CardDescription>Transfer details and school information</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="schoolLeavingFrom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School Leaving From *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select school" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Shri Gandhi Inter College Orai">Shri Gandhi Inter College Orai</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {[["schoolLeavingTo", "Last Institution"],
                ].map(([name, label]) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name as keyof FormData}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <FormField
                  control={form.control}
                  name="issueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issue Date *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Dynamic Admission History */}
                <div className="md:col-span-2 space-y-4">
                  <Label className="text-base">Class Admission & Promotion History</Label>
                  {fields.map((item, index) => (
                    <div key={item.id} className="grid md:grid-cols-4 gap-4 items-end">
                      {["className", "admissionDate","promotionDate"].map((fieldName) => (
                        <FormField
                          key={fieldName}
                          control={form.control}
                          name={`admissionHistory.${index}.${fieldName}` as any}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {index === 0 && fieldName === "className"
                                  ? "Class Admitted"
                                  : fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
                              </FormLabel>
                              <FormControl>
                                <Input  type={["admissionDate", "promotionDate"].includes(fieldName) ? "date" : "text"} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                      <FormField
                        control={form.control}
                        name={`admissionHistory.${index}.session`}
                        render={({ field }) => {
                          const currentYear = new Date().getFullYear();
                          const sessionYears = Array.from({ length: 21 }, (_, i) => {
                            const startYear = currentYear - 10 + i;
                            return `${startYear}-${startYear + 1}`;
                          });
                          return (
                            <FormItem>
                              <FormLabel>Session</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select session" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {sessionYears.map((s) => (
                                    <SelectItem key={s} value={s}>
                                      {s}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                      <FormField
                        control={form.control}
                        name={`admissionHistory.${index}.conduct`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Conduct</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter conduct" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />


                      {index > 0 && (
                        <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => append({ className: "", admissionDate:"",promotionDate:"", session: "", conduct: "" })}>
                    + Add Class Promotion
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-end gap-4">
              <Link href="/">
                <Button variant="outline" className=" hover:bg-red-500">Cancel</Button>
              </Link>
              <Button type="submit" className="bg-blue-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Save Transfer Certificate
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
