import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Record {
  recordId: string;
  userId: string;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Rejected';
  priority: 'Low' | 'Medium' | 'High';
  category: string;
  accessLevel: 'Public' | 'Private' | 'Restricted';
  assignedTo?: string;
  createdBy: string;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecordResponse {
  success: boolean;
  data?: Record | Record[];
  count?: number;
  userRole?: string;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class RecordService {
  constructor(private http: HttpClient) {}

  /**
   * Get all records for current user
   * Admin users get all records, General users get only their records
   */
  getRecords(delay?: number): Observable<RecordResponse> {
    let params = new HttpParams();
    if (delay !== undefined) {
      params = params.set('delay', delay.toString());
    }
    
    return this.http.get<RecordResponse>(`${environment.apiUrl}/records`, { params });
  }

  /**
   * Get record by ID
   */
  getRecordById(recordId: string, delay?: number): Observable<RecordResponse> {
    let params = new HttpParams();
    if (delay !== undefined) {
      params = params.set('delay', delay.toString());
    }
    
    return this.http.get<RecordResponse>(`${environment.apiUrl}/records/${recordId}`, { params });
  }

  /**
   * Create new record
   */
  createRecord(recordData: Partial<Record>): Observable<RecordResponse> {
    return this.http.post<RecordResponse>(`${environment.apiUrl}/records`, recordData);
  }

  /**
   * Update record
   */
  updateRecord(recordId: string, recordData: Partial<Record>): Observable<RecordResponse> {
    return this.http.put<RecordResponse>(`${environment.apiUrl}/records/${recordId}`, recordData);
  }

  /**
   * Delete record
   */
  deleteRecord(recordId: string): Observable<RecordResponse> {
    return this.http.delete<RecordResponse>(`${environment.apiUrl}/records/${recordId}`);
  }
}