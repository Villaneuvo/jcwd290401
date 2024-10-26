"use client";

import { Container } from "@/components/Container";
import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SkillAssessment } from "@/utils/interfaces";

export default function SkillAssessmentDiscovery() {
    const [skillAssessment, setSkillAssessment] = useState<SkillAssessment[]>([]);

    useEffect(() => {
        // Fetch data from API
        async function fetchData() {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL_API}/api/v1/skill-assessment/quiz/`);
                const data = res.data.data;
                console.log(data);
                setSkillAssessment(data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, []);

    return (
        <div className="bg-white">
            <Container className="mx-10 my-5 rounded-lg bg-blue-300 p-5 xl:mx-auto">
                {/* Title Section */}
                <div className="w-full">
                    <h3 className="text-2xl font-semibold text-gray-900">Skill Assessment</h3>
                    <p className="my-4 text-sm leading-relaxed lg:w-3/5">
                        Test your skill and get a job that suits you best with our skill assessment test. We provide a
                        variety of tests that you can take to find out your skills and abilities. Earn a badge for each
                        test by passing the test.
                    </p>
                </div>

                {/* Solid line div*/}
                <div className="my-5 border-b-2 border-gray-300"></div>

                {/* Card Section */}
                <div>
                    {skillAssessment.map((item) => (
                        <div key={item.id} className="my-5 rounded-lg bg-white p-5 shadow-md">
                            <div className="flex gap-x-8">
                                <div className="h-fit w-fit">
                                    <Image
                                        src={`https://skillicons.dev/icons?i=${item.skillName.toLowerCase()}`}
                                        height={100}
                                        width={100}
                                        alt={"jeje"}
                                    />
                                </div>
                                <div className="flex w-3/4 flex-col justify-center">
                                    <h4>{item.skillName}</h4>
                                    <p>{item.description}</p>
                                </div>
                                <div className="flex items-center">
                                    <Link
                                        href={`skill-assessment/quiz/${item.id}`}
                                        className="bg-reseda-green hover:bg-reseda-green/70 rounded-md p-2 font-medium text-white transition delay-100 duration-300"
                                    >
                                        Take Test
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
}