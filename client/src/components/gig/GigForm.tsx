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
import { resetGigData, setGigData } from "@/features/gig/gigSlice";
import { useNavigate } from "react-router-dom";

interface GigFormProps {
  onSuccess: (status: boolean) => void;
}

export default function GigForm({ onSuccess }: GigFormProps) {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const gigData = useSelector((state: RootState) => state.gig);
  const walletAddress = useSelector((state: RootState) => state.auth.walletAddress) || "";

  const [createGig, { isLoading, isError, isSuccess }] = useCreateGigMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    dispatch(setGigData({ 
      ...gigData,
      walletAddress,
      [name]: name==="features" ? value.split(",").map((item) => item.trim()) : value 
    }));
  };  
  // console.log("Gigdata: ", gigData);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createGig(gigData).unwrap();
      onSuccess(true);
      dispatch(resetGigData());
      setTimeout(() => {
        navigate('/client-dashboard');
      }, 3000);
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
          <Input type="text" name="title" value={gigData.gig.title} onChange={handleChange} placeholder="e.g., Mobile App Development" />
        </div>

        <div>
          <Label>Description</Label>
          <Textarea value={gigData.gig.description} name="description" onChange={handleChange} rows={4} placeholder="Describe your project requirements..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Category</Label>
            <Select value={gigData.gig.category} name="category" onValueChange={(value) => dispatch(setGigData({ ...gigData, category: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="development">Development</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="writing">Writing</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="photography">Photography</SelectItem>
                <SelectItem value="translation">Translation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Budget</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <Input value={gigData.gig.price} name="price" onChange={handleChange} type="number" className="pl-10" placeholder="1000" />
            </div>
          </div>
        </div>

        <div>
          <Label>Required Skills</Label>
          <Input value={gigData.gig.features} name="features" onChange={handleChange} type="text" placeholder="e.g., React, Node.js, TypeScript" />
        </div>

        <div>
          <Label>Project Deadline</Label>
          <Input value={gigData.gig.deliveryTime} name="deliveryTime" onChange={handleChange} />
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
