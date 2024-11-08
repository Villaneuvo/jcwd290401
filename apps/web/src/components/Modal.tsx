"use client";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "./Button";
import clsx from "clsx";

type ModalProps = {
    open: boolean;
    onSubmit?: () => void;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    className?: string;
};

export default function Modal({ open, onClose, title = "", children, className, onSubmit = () => {} }: ModalProps) {
    return (
        <Dialog open={open} onClose={onClose} className="relative z-10">
            <DialogBackdrop
                transition
                className="relative transform rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            />
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                    >
                        <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                <span className="sr-only">Close</span>
                                <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                            </button>
                        </div>
                        <div className={clsx(className)}>
                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                {title ? (
                                    <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                        {title}
                                    </DialogTitle>
                                ) : null}
                                <div className="mt-2">{children}</div>
                            </div>
                        </div>
                        <div className="mt-5 flex justify-end space-x-2 sm:mt-4">
                            <Button onClick={onClose} outline>
                                Cancel
                            </Button>
                            <Button onClick={onSubmit}>Submit</Button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}
