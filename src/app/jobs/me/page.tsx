"use client";

import FlexContainer from "@/components/FlexContainer";
import Loader from "@/components/Loader";
import ShadcnButton from "@/components/ShadcnButton";
import Wrapper from "@/components/Wrapper";
import { cn } from "@/lib/utils";
import { Avatar } from "@nextui-org/react";
import { Star } from "lucide-react";
import { ObjectId } from "mongodb";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { MongoJob } from "../[id]/page";

type Props = {};

const Page = (props: Props) => {
  const [jobs, setJobs] = React.useState<MongoJob[] | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  useEffect(() => {
    const fetchJob = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/jobs/me");
        const data = await res.json();
        if (data.success) {
          setJobs(data.data);
          toast.success(data.message);
          console.log(data.data, "data");
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        const err = error as Error & { message: string };
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJob();
  }, []);

  return (
    <Wrapper className="px-10 py-5">
      <FlexContainer variant="column-start" gap="xl">
        <FlexContainer variant="row-between">
          <FlexContainer variant="column-start" gap="none">
            <h3 className="text-3xl font-bold">My Jobs</h3>
            <h5 className="text-lg font-medium text-gray-500">
              Jobs you have created
            </h5>
          </FlexContainer>
          <Link href="/jobs/create">
            <ShadcnButton variant="default">Create Jobs</ShadcnButton>
          </Link>
        </FlexContainer>
        {isLoading && <Loader />}
        {jobs?.length === 0 && (
          <h3 className="text-3xl font-bold">No Jobs Found</h3>
        )}
        <FlexContainer variant="column-start" gap="sm">
          {jobs &&
            jobs.map((item) => <Job key={item._id.toString()} job={item} />)}
        </FlexContainer>
      </FlexContainer>
    </Wrapper>
  );
};

const Job = ({ job }: { job: MongoJob }) => {
  const [rating, setRating] = React.useState<number>(0);
  const handleUpdateJob = async () => {
    try {
      const res = await fetch("/api/jobs/bid/completed/" + job._id.toString());
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        console.log(data.data, "data");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const err = error as Error & { message: string };
      toast.error(err.message);
    }
  };

  const handleAddReview = async () => {
    try {
      const res = await fetch("/api/jobs/review/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          ratedBy: job?.postAdmin?.id,
          ratedByUserName: job?.postAdmin?.username,
          userId: job?.acceptedBid?.user?.id,
          postId: job._id.toString(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        console.log(data.data, "data");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const err = error as Error & { message: string };
      toast.error(err.message);
    }
  };
  return (
    <FlexContainer
      variant="column-start"
      className={cn(
        "cursor-pointer rounded-xl p-1.5",
        job?.status === "in-progress" && "bg-yellow-50",
        job?.status === "open" && "bg-rose-50",
        job?.status === "closed" && "bg-green-50",
      )}
    >
      <Link href={`/jobs/${job._id}`}>
        <FlexContainer
          variant="column-start"
          gap="sm"
          className={cn(
            "rounded-xl bg-zinc-100 p-3",
            job?.status === "in-progress" && "bg-yellow-200",
            job?.status === "open" && "bg-rose-200",
            job?.status === "closed" && "bg-green-200",
          )}
        >
          <FlexContainer variant="row-between">
            <FlexContainer variant="row-start">
              <Avatar
                showFallback
                src={job?.images?.length ? job.images[0].url : ""}
                className="h-12 w-12 rounded-xl"
              />
              <FlexContainer variant="column-start" gap="none">
                <h5 className="text-lg font-bold">{job.title}</h5>
                <p className="text-sm font-medium text-zinc-800">
                  {job.description}
                </p>
              </FlexContainer>
            </FlexContainer>
            <FlexContainer variant="row-end" gap="xl">
              <FlexContainer
                variant="column-end"
                gap="none"
                className="justify-center"
              >
                <p className="text-sm font-medium text-zinc-800">
                  Budget {job.budget}
                </p>
                <p className="text-sm font-medium text-zinc-800">
                  by: {job?.postAdmin?.username}
                </p>
              </FlexContainer>
              <FlexContainer
                variant="column-end"
                gap="none"
                className="justify-center"
              >
                <p className="text-sm font-medium text-zinc-800">
                  Status {job.status}
                </p>
                <p className="text-sm font-medium text-zinc-800">
                  Bidder Name: {job?.acceptedBid?.user?.username}
                </p>
              </FlexContainer>
            </FlexContainer>
          </FlexContainer>
        </FlexContainer>
      </Link>
      {job?.status === "closed" && (
        <FlexContainer variant="row-end" className="items-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={24}
              className={cn(
                "fill-yellow-400 text-yellow-400",
                i >= rating && "fill-gray-200 text-gray-200",
              )}
              onClick={() => setRating(i + 1)}
            />
          ))}
          <ShadcnButton
            variant="secondary"
            className="rounded-3xl px-4 py-1 text-xs font-semibold"
            onClick={handleAddReview}
          >
            rate
          </ShadcnButton>
        </FlexContainer>
      )}
      {job?.status === "in-progress" && (
        <FlexContainer variant="row-end" className="">
          <ShadcnButton
            variant="success"
            className="rounded-3xl px-3 py-2"
            onClick={handleUpdateJob}
          >
            set as completed
          </ShadcnButton>
        </FlexContainer>
      )}
    </FlexContainer>
  );
};

export default Page;
