import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from './auth.service';

export interface UserResponse {
  success: boolean;
  data?: User | User[];
  count?: number;
  message?: string;
}

export interface CreateUserRequest {
  userId: string;
  password: string;
  role: 'General User' | 'Admin';
  name: string;
  email: string;
  department?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  /**
   * Get all users (Admin only)
   */
  getAllUsers(delay?: number): Observable<UserResponse> {
    let params = new HttpParams();
    if (delay !== undefined) {
      params = params.set('delay', delay.toString());
    }
    
    return this.http.get<UserResponse>(`${environment.apiUrl}/users`, { params });
  }

  /**
   * Get user by ID (Admin only)
   */
  getUserById(userId: string, delay?: number): Observable<UserResponse> {
    let params = new HttpParams();
    if (delay !== undefined) {
      params = params.set('delay', delay.toString());
    }
    
    return this.http.get<UserResponse>(`${environment.apiUrl}/users/${userId}`, { params });
  }

  /**
   * Create new user (Admin only)
   */
  createUser(userData: CreateUserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${environment.apiUrl}/users`, userData);
  }

  /**
   * Update user (Admin only)
   */
  updateUser(userId: string, userData: Partial<CreateUserRequest>): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${environment.apiUrl}/users/${userId}`, userData);
  }

  /**
   * Delete user (Admin only)
   */
  deleteUser(userId: string): Observable<UserResponse> {
    return this.http.delete<UserResponse>(`${environment.apiUrl}/users/${userId}`);
  }
}