import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService, User } from '../../core/services/auth.service';
import { RecordService, Record } from '../../core/services/record.service';
import { UserService } from '../../core/services/user.service';
import { environment } from '../../../environments/environment';
import { Subject, takeUntil, finalize } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  records: Record[] = [];
  users: User[] = [];
  
  loadingUser = false;
  loadingRecords = false;
  loadingUsers = false;
  
  error: string | null = null;
  
  // Table columns configuration
  recordColumns = [
    { key: 'recordId', label: 'Record ID', sortable: true },
    { key: 'title', label: 'Title', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'priority', label: 'Priority', sortable: true },
    { key: 'accessLevel', label: 'Access Level', sortable: true },
    { key: 'createdAt', label: 'Created At', sortable: true },
  ];

  userColumns = [
    { key: 'userId', label: 'User ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'department', label: 'Department', sortable: true },
  ];

  // For async demo
  apiDelay = environment.apiDelay;
  showDelayInfo = false;

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private recordService: RecordService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUserDetails();
    this.loadRecords();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load current user details with delay simulation
   */
  loadUserDetails(): void {
    this.loadingUser = true;
    this.error = null;
    
    this.authService
      .getCurrentUser()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.loadingUser = false))
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.currentUser = response.data;
            
            // Load users if admin
            if (this.isAdmin()) {
              this.loadUsers();
            }
          }
        },
        error: (error) => {
          this.error = 'Failed to load user details';
          console.error('Load user error:', error);
        },
      });
  }

  /**
   * Load records with delay simulation
   */
  loadRecords(): void {
    this.loadingRecords = true;
    this.error = null;
    
    this.recordService
      .getRecords(this.apiDelay)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.loadingRecords = false))
      )
      .subscribe({
        next: (response) => {
          if (response.success && Array.isArray(response.data)) {
            this.records = response.data;
          }
        },
        error: (error) => {
          this.error = 'Failed to load records';
          console.error('Load records error:', error);
        },
      });
  }

  /**
   * Load all users (Admin only) with delay simulation
   */
  loadUsers(): void {
    this.loadingUsers = true;
    
    this.userService
      .getAllUsers(this.apiDelay)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.loadingUsers = false))
      )
      .subscribe({
        next: (response) => {
          if (response.success && Array.isArray(response.data)) {
            this.users = response.data;
          }
        },
        error: (error) => {
          console.error('Load users error:', error);
        },
      });
  }

  /**
   * Check if current user is admin
   */
  isAdmin(): boolean {
    return this.currentUser?.role === 'Admin';
  }

  /**
   * Get status badge class
   */
  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'Pending': 'status-pending',
      'In Progress': 'status-progress',
      'Completed': 'status-completed',
      'Rejected': 'status-rejected',
    };
    return statusClasses[status] || 'status-default';
  }

  /**
   * Get priority badge class
   */
  getPriorityClass(priority: string): string {
    const priorityClasses: { [key: string]: string } = {
      'Low': 'priority-low',
      'Medium': 'priority-medium',
      'High': 'priority-high',
    };
    return priorityClasses[priority] || 'priority-default';
  }

  /**
   * Get access level badge class
   */
  getAccessClass(accessLevel: string): string {
    const accessClasses: { [key: string]: string } = {
      'Public': 'access-public',
      'Private': 'access-private',
      'Restricted': 'access-restricted',
    };
    return accessClasses[accessLevel] || 'access-default';
  }

  /**
   * Format date
   */
  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  /**
   * Logout
   */
  logout(): void {
    this.authService.logout();
  }

  /**
   * Refresh data
   */
  refreshData(): void {
    this.loadUserDetails();
    this.loadRecords();
  }

  /**
   * Toggle delay info
   */
  toggleDelayInfo(): void {
    this.showDelayInfo = !this.showDelayInfo;
  }
}
