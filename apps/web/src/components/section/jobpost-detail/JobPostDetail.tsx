'use client';

import { DescriptionDetails, DescriptionList, DescriptionTerm } from '@/components/description-list';
import { Subheading } from '@/components/heading';
import { Dialog, DialogActions, DialogDescription, DialogTitle } from '@/components/dialog';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { formatCurrency, formatDate } from '@/utils/helpers';
import { Button } from '@/components/button';
import ApplicantListTable from './ApplicantListTable';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function JobPostDetail({ id, adminId }: { id: string; adminId: string }) {
    const [jobPost, setJobPost] = useState<Partial<JobPost>>({});
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    useEffect(() => {
        async function fetchJobPost() {
            try {
                const params = {
                    adminId: +adminId,
                };
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BASE_URL_API}/api/v1/jobposts/admin/${id}`,
                    {
                        params,
                    },
                );
                setJobPost(response.data);
            } catch (error) {
                console.error('Error fetching job post:', error);
            }
        }
        fetchJobPost();
    }, []);
    const handleTogglePublish = async (changePublish: boolean) => {
        try {
            const bodyRequest = {
                adminId: +adminId,
                published: changePublish,
            };
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_BASE_URL_API}/api/v1/jobposts/togglePublish/${id}`,
                bodyRequest,
            );
            console.log('response', response);
            window.location.reload();
        } catch (error) {
            console.error('Error process publish', error);
        }
    };
    const handleEditJobPost = () => {
        router.push(`/jobposts/${id}/edit`);
    };
    const handleDeleteJobPost = async () => {
        try {
            const bodyRequest = {
                adminId: +adminId,
            };
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL_API}/api/v1/jobposts/admin/${id}`, {
                data: bodyRequest,
            });
            console.log('response', response);
            router.push('/jobposts');
        } catch (error) {
            console.error('Error delete job post', error);
        }
    };
    return (
        <div className="p-2">
            <div className="flex flex-col items-center justify-between sm:flex-row">
                <Subheading>Job Post Detail - {jobPost.title}</Subheading>
                <div className="flex space-x-2">
                    {jobPost.published ? (
                        <Button onClick={() => handleTogglePublish(false)} color="zinc">
                            Unpublish
                        </Button>
                    ) : (
                        <Button onClick={() => handleTogglePublish(true)} color="green">
                            Publish
                        </Button>
                    )}
                    <Button onClick={() => handleEditJobPost()} color="blue">
                        Edit
                    </Button>
                    <Button onClick={() => setIsOpen(true)} color="red">
                        Delete
                    </Button>
                </div>
            </div>
            <DescriptionList className="mt-4">
                <DescriptionTerm>Title</DescriptionTerm>
                <DescriptionDetails>{jobPost.title}</DescriptionDetails>

                <DescriptionTerm>Published</DescriptionTerm>
                <DescriptionDetails>{jobPost.published ? 'Published' : 'Not Published'}</DescriptionDetails>

                <DescriptionTerm>Description</DescriptionTerm>
                <DescriptionDetails>{jobPost.description}</DescriptionDetails>

                <DescriptionTerm>Banner</DescriptionTerm>
                <DescriptionDetails>
                    {jobPost.bannerUrl ? (
                        <div className="relative my-1 h-32 w-32 overflow-hidden rounded-lg">
                            <Image
                                src={jobPost.bannerUrl}
                                fill={true}
                                sizes="(max-width: 768px) 100vw, 128px"
                                alt="Banner"
                                className="object-cover"
                                priority
                            />
                        </div>
                    ) : (
                        'No Banner'
                    )}
                </DescriptionDetails>

                <DescriptionTerm>Category</DescriptionTerm>
                <DescriptionDetails>{jobPost.category}</DescriptionDetails>

                <DescriptionTerm>City Location</DescriptionTerm>
                <DescriptionDetails>{jobPost.cityLocation}</DescriptionDetails>

                <DescriptionTerm>Salary</DescriptionTerm>
                <DescriptionDetails>{formatCurrency(jobPost.salary || 0)}</DescriptionDetails>

                <DescriptionTerm>Application Due Date</DescriptionTerm>
                <DescriptionDetails>{formatDate(jobPost.applicationDeadline)}</DescriptionDetails>
            </DescriptionList>

            {/* <ApplicantListTable jobApplications={jobPost.jobApplications || []} /> */}

            <Dialog open={isOpen} onClose={setIsOpen}>
                <DialogTitle>Delete Job Post</DialogTitle>
                <DialogDescription>
                    Are you sure you want to delete this job post? This action cannot be undone, and the post will be
                    permanently removed.
                </DialogDescription>
                <DialogActions>
                    <Button plain onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            handleDeleteJobPost();
                            setIsOpen(false);
                        }}
                        color="red"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}