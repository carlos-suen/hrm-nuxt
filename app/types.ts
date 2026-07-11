// ===== 績效 =====
export interface EmployeePerformanceData {
  id: number
  name: string
  duration: string
  score: number
  level: string
  status: number
  monitor: string
}

// ===== 圖表 =====
export interface ChartData {
  name: string
  value?: number
  fill?: string
  attendance?: number
  late?: number
  [key: string]: string | number | undefined
}

// ===== 表單控件 =====
export interface SelectOption {
  value: number | string
  label: string
}

// ===== 審批 =====
export interface Approval {
  id?: number
  ename: string
  type: number
  start_time: string
  end_time: string
  reason: string
  status: number
  created_at?: string
}

// ===== 薪資 =====
export type PayStatus = 'Draft' | 'Confirmed' | 'Paid'

export interface PayRecord {
  id: number
  name: string
  email: string
  avatar: string
  department: string
  baseSalary: string
  bonus: string
  deduction: string
  netPay: string
  status: PayStatus
}

// ===== 招聘 =====
export type RecruitmentStatus = 'open' | 'paused' | 'closed'
export type JobType = '全職' | '實習' | '兼職'

export interface RecruitmentJob {
  id: number
  title: string
  department: string
  location: string
  salaryMin: string
  salaryMax: string
  applicantCount: number
  type: JobType
  status: RecruitmentStatus
}

export interface JobCardProps {
  id: number
  title: string
  department: string
  location: string
  salaryMin: string
  salaryMax: string
  applicantCount: number
  type: JobType
}

// ===== 培訓 =====
export interface TrainingCourseInfo {
  id: number
  title: string
  type: string
  desc?: string
  startTime: string
  endTime?: string
  location?: string
  maxPeople?: number
  currentJoin?: number
  status?: string
  instructor?: string
}

// ===== 考勤 =====
export type AttendanceStatus = 'Normal' | 'Late' | 'Absent' | 'EarlyLeave'

export interface AttendanceRecord {
  id: number
  name: string
  email: string
  avatar: string
  date: string
  clockIn: string | null
  clockOut: string | null
  status: AttendanceStatus
  hours: string
}

// ===== 考勤日曆 =====
export type CalendarItemType = 'Normal' | 'Late' | 'ELeave' | 'Absent' | 'OLeave' | 'Future' | 'Weekend'

export interface CalendarAreaData {
  tagColor: string
  title: string
}

export interface CalenderItemData {
  title: string
  type: CalendarItemType
}

// ===== 表單數據 =====
export interface EmployeeFormData {
  id: string
  eid: string
  name: string
  department: string
  pos: string
  sal: string
  start_date: string
  status: string
}

export interface CourseFormData {
  title: string
  instructor: string
  type: string
  startDate: string
  endDate: string
  duration: string
  capacity: string
  location: string
  description: string
}

export interface RecruitmentFormData {
  title: string
  department: string
  type: string
  location: string
  salaryMin: string
  salaryMax: string
  description: string
  requirements: string
}