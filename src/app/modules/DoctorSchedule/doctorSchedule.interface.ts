export type TDoctorScheduleIds = {
    scheduleIds: string[]
}

export type TDoctorScheduleFilterRequest = {
    searchTerm?: string | undefined;
    isBooked?: boolean | undefined;
};