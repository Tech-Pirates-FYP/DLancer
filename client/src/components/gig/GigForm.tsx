import React, { useState } from "react";
import { DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useCreateGigMutation } from "@/features/gig/gigAPI";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "@/features/store";
import { setGigData } from "@/features/gig/gigSlice";

export default function GigForm() {

  
  const dispatch = useDispatch();
  
  const gigData = useSelector((state: RootState) => state.gig);

  const [createGig, { isLoading, isError, isSuccess }] = useCreateGigMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    dispatch(setGigData({ 
      ...gigData,
      [name]: name==="features" ? value.split(",").map((item) => item.trim()) : value 
    }));
  };  
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createGig(gigData).unwrap();
      console.log("Gig created successfully!");
    } catch (error) {
      console.error("Error creating gig:", error);
    }
  };

  return (
    <Card className="p-6">
      <form className="space-y-6">
        <div>
          <Label>Project Title</Label>
          <Input type="text" name="title" value={gigData.title} onChange={handleChange} placeholder="e.g., Mobile App Development" />
        </div>

        <div>
          <Label>Description</Label>
          <Textarea value={gigData.description} name="description" onChange={handleChange} rows={4} placeholder="Describe your project requirements..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Category</Label>
            <Select value={gigData.category} name="category" onValueChange={(value) => dispatch(setGigData({ ...gigData, category: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="development">Development</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="writing">Writing</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Budget</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <Input value={gigData.price} name="price" onChange={handleChange} type="number" className="pl-10" placeholder="1000" />
            </div>
          </div>
        </div>

        <div>
          <Label>Required Skills</Label>
          <Input value={gigData.features} name="features" onChange={handleChange} type="text" placeholder="e.g., React, Node.js, TypeScript" />
        </div>

        <div>
          <Label>Project Deadline</Label>
          <Input value={gigData.deliveryTime} name="deliveryTime" onChange={handleChange} />
        </div>

        <Button onClick={handleSubmit} className="w-full">
          Post Project
        </Button>

        {isSuccess && <p>Gig created successfully!</p>}
        {isError && <p>Error creating gig.</p>}

      </form>
    </Card>
  );
}
