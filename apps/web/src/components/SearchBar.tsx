"use client";

import { useEffect, useReducer, useRef } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import { ACTIONS } from "../utils/action-search";
import { reducer, initialState } from "../utils/reducer-search";
import { fetchProviceLocation } from "../utils/fetch-province-location";
import { SearchJobPosition } from "@/utils/interfaces";
import { SearchBarLocationResult, SearchBarResultPosition } from "./SearchBarResult";
import Link from "next/link";

export default function SearchBar() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { locationInput, debounceInput, positionInput, locationList, positionList, allLocations, showSuggestions } =
        state;
    const suggestionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            const formattedLocations = await fetchProviceLocation(debounceInput);
            dispatch({ type: ACTIONS.SET_ALL_LOCATIONS, payload: formattedLocations });
            dispatch({ type: ACTIONS.SET_LOCATION_LIST, payload: formattedLocations });
        };
        fetchData();
    }, [debounceInput]);

    useEffect(() => {
        async function fetchData() {
            if (!positionInput) {
                dispatch({ type: ACTIONS.SET_POSITION_LIST, payload: [] });
                return;
            }

            let params: { page: number; limit: number; title?: string } = {
                page: 1,
                limit: 100,
                title: positionInput,
            };

            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL_API}/api/v1/jobposts`, { params });
                const rawData = res.data.data;

                console.log("Fetched Data: ", rawData);
                dispatch({ type: ACTIONS.SET_POSITION_LIST, payload: rawData });
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, [positionInput]);

    // Debounce for PositionInput Handling
    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch({ type: ACTIONS.SET_DEBOUNCE_INPUT, payload: positionInput });
        }, 500);
        return () => clearTimeout(timer);
    }, [positionInput]);

    useEffect(() => {
        if (debounceInput === "" && locationInput === "") {
            dispatch({ type: ACTIONS.SET_SHOW_SUGGESTIONS, payload: false });
        } else {
            dispatch({ type: ACTIONS.SET_POSITION_LIST, payload: positionList });
            dispatch({ type: ACTIONS.SET_SHOW_SUGGESTIONS, payload: true });
        }
    }, [debounceInput, positionList, locationInput]);

    // Debounce for location input
    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch({ type: ACTIONS.SET_DEBOUNCE_INPUT, payload: locationInput });
        }, 500);
        return () => clearTimeout(timer);
    }, [locationInput]);

    useEffect(() => {
        if (debounceInput === "") {
            dispatch({ type: ACTIONS.SET_LOCATION_LIST, payload: allLocations });
        } else {
            const filteredLocations = allLocations.filter((location: string) =>
                location.toLowerCase().includes(debounceInput.toLowerCase()),
            );
            dispatch({ type: ACTIONS.SET_LOCATION_LIST, payload: filteredLocations });
        }
    }, [debounceInput, allLocations]);

    const handleChangeLocationInput = (val: string) => {
        dispatch({ type: ACTIONS.SET_LOCATION_INPUT, payload: val });
        dispatch({ type: ACTIONS.SET_SHOW_SUGGESTIONS, payload: true });
    };

    const handleChangePositionInput = (val: string) => {
        dispatch({ type: ACTIONS.SET_POSITION_INPUT, payload: val });
        dispatch({ type: ACTIONS.SET_SHOW_SUGGESTIONS, payload: true });
    };

    const handleSelectPosition: React.Dispatch<React.SetStateAction<string>> = (position) => {
        dispatch({ type: ACTIONS.SET_POSITION_INPUT, payload: position });
        dispatch({ type: ACTIONS.SET_SHOW_SUGGESTIONS, payload: false });
    };

    const handleSelectLocation: React.Dispatch<React.SetStateAction<string>> = (location) => {
        dispatch({ type: ACTIONS.SET_LOCATION_INPUT, payload: location });
        dispatch({ type: ACTIONS.SET_SHOW_SUGGESTIONS, payload: false });
    };

    const handleBlurSuggestions = () => {
        setTimeout(() => {
            dispatch({ type: ACTIONS.SET_SHOW_SUGGESTIONS, payload: false });
        }, 150);
    };

    const handleFocusSuggestions = () => {
        dispatch({ type: ACTIONS.SET_SHOW_SUGGESTIONS, payload: true });
    };

    return (
        <>
            <div className="mt-6 flex flex-col gap-y-5 sm:flex-row">
                <div className="flex flex-col gap-y-5 sm:flex-row sm:rounded-l-md sm:border sm:border-black/25 sm:bg-gray-100">
                    <input
                        type="text"
                        value={positionInput}
                        placeholder="Posisi atau Perusahaan"
                        onChange={(e) => handleChangePositionInput(e.target.value)}
                        className="focus:ring-reseda-green rounded-md bg-gray-100 bg-[url('/building-office.svg')] bg-[length:20px_20px] bg-[24px_50%] bg-no-repeat p-6 pl-12 text-sm text-gray-700 focus:outline-none focus:ring-2 sm:w-60 sm:rounded-none sm:rounded-l-md sm:border-black/25 lg:w-72"
                        onBlur={handleBlurSuggestions}
                        onFocus={handleFocusSuggestions}
                    />

                    <input
                        type="text"
                        value={locationInput}
                        onChange={(e) => handleChangeLocationInput(e.target.value)}
                        placeholder="Lokasi"
                        className="focus:ring-reseda-green rounded-md bg-gray-100 bg-[url('/location.svg')] bg-[length:20px_20px] bg-[24px_50%] bg-no-repeat p-6 pl-12 text-sm text-gray-700 focus:outline-none focus:ring-2 sm:w-32 sm:rounded-none sm:border-l sm:border-black/25 lg:w-48"
                        onBlur={handleBlurSuggestions}
                        onFocus={handleFocusSuggestions}
                    />
                </div>
                <button className="bg-reseda-green hover:bg-reseda-green/75 hidden gap-x-2 rounded-md p-6 sm:flex sm:rounded-none sm:rounded-r-md">
                    <MagnifyingGlassIcon className="h-5 w-5 text-white" />
                    <Link href={"/jobs"} className="font-medium text-white">
                        Cari
                    </Link>
                </button>
            </div>

            {/* Based on Location Input Result */}
            {showSuggestions && locationInput !== "" && (
                <div
                    ref={suggestionRef}
                    className="border-text-main/25 mt-2 max-h-48 overflow-x-hidden overflow-y-scroll rounded-md border bg-white shadow-2xl"
                    onMouseDown={() => handleFocusSuggestions()}
                    onMouseLeave={() => handleBlurSuggestions()}
                >
                    <ul className="py-1">
                        {locationList.length === 0 ? (
                            <li className="text-text-main px-4 py-2 text-sm leading-5">Tidak ada hasil</li>
                        ) : (
                            locationList.map((location: string) => (
                                <SearchBarLocationResult
                                    key={location}
                                    location={location}
                                    handleSelectLocation={handleSelectLocation}
                                />
                            ))
                        )}
                    </ul>
                </div>
            )}

            {/* Based on Position Input Result */}
            {showSuggestions && positionInput !== "" && (
                <div
                    ref={suggestionRef}
                    className="border-text-main/25 mt-2 max-h-48 overflow-x-hidden overflow-y-scroll rounded-md border bg-white shadow-2xl"
                    onMouseDown={() => handleFocusSuggestions()}
                    onMouseLeave={() => handleBlurSuggestions()}
                >
                    <ul className="py-1">
                        {positionList.length === 0 ? (
                            <li className="text-text-main px-4 py-2 text-sm leading-5">Tidak ada hasil</li>
                        ) : (
                            positionList.map((position: SearchJobPosition) => (
                                <SearchBarResultPosition
                                    key={position.id}
                                    position={position}
                                    handleSelectPosition={handleSelectPosition}
                                />
                            ))
                        )}
                    </ul>
                </div>
            )}

            {/* Mobile only */}
            <button className="bg-reseda-green hover:bg-reseda-green/75 mt-5 flex w-full gap-x-2 rounded-md p-6 sm:hidden sm:rounded-none sm:rounded-r-md">
                <MagnifyingGlassIcon className="h-5 w-5 text-white" />
                <span className="font-medium text-white">Cari</span>
            </button>
        </>
    );
}
