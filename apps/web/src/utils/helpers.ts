export function formatCurrency(value: number) {
    if (value <= 0) {
        return "No Salary";
    }
    return new Intl.NumberFormat("id-ID", currencyFormatOptions).format(value);
}

export function formatDate(date1: Date | undefined) {
    let date;
    if (date1) {
        date = new Date(date1);
    } else {
        return;
    }

    // Opsi format tanggal
    const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    };

    return new Intl.DateTimeFormat("id", options).format(date);
}
export function formatDateExpiredDateCV(date1: Date | undefined) {
    let date;
    if (date1) {
        date = new Date(date1);
    } else {
        return;
    }

    // Opsi format tanggal
    const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
        year: "numeric",
    };

    return new Intl.DateTimeFormat("id", options).format(date);
}

export const currencyFormatOptions: Intl.NumberFormatOptions = {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
};
