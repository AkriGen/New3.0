import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CreateHealthTipDTO, ReadHealthTipDTO, UpdateHealthTipDTO } from '../../models/health-tips-dto.Model';
import { HealthTipsService } from '../../admin-services/health-tips.service';

@Component({
  selector: 'app-admin-health-tip-form',
  templateUrl: './admin-health-tip-form.component.html',
  styleUrls: ['./admin-health-tip-form.component.css'],
  imports: [FormsModule, CommonModule],
})
export class AdminHealthTipFormComponent implements OnInit {
  healthTip: CreateHealthTipDTO | UpdateHealthTipDTO = {
    TipTitle: '',
    TipDescription: '',
    CategoryId: 0,
    HealthTipsimg: null,
  };

  isEditMode: boolean = false;
  healthTipId: number | null = null;

  constructor(
    private healthTipsService: HealthTipsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check if we're in edit mode and load health tip details if so
    this.route.queryParams.subscribe((params) => {
      if (params['id']) {
        this.healthTipId = +params['id']; // Convert to number
        this.isEditMode = true;
        this.loadHealthTip(this.healthTipId); // Load health tip details for editing
      }
    });
  }

  // Load health tip details for editing
  loadHealthTip(id: number): void {
    this.healthTipsService.getHealthTip(id).subscribe(
      (healthTip: ReadHealthTipDTO) => {
        // Map fetched health tip to the form healthTip object
        this.healthTip = {
          TipTitle: healthTip.TipTitle,
          TipDescription: healthTip.TipDescription,
          CategoryId: healthTip.CategoryId,
          HealthTipsimg: healthTip.HealthTipsimg, // If no image, set null
        };
      },
      (error) => {
        console.error('Error fetching health tip:', error);
      }
    );
  }

  // Handle form submission (for both adding and updating a health tip)
  onSubmit(): void {
    if (this.isEditMode && this.healthTipId !== null) {
      // Prepare the UpdateHealthTipDTO
      const updateHealthTipDTO: UpdateHealthTipDTO = {
        TipId: this.healthTipId,
        TipTitle: this.healthTip.TipTitle,
        TipDescription: this.healthTip.TipDescription,
        CategoryId: this.healthTip.CategoryId,
        HealthTipsimg: this.healthTip.HealthTipsimg, // For image handling in update
      };

      // Call update service method
      this.healthTipsService.updateHealthTip(updateHealthTipDTO).subscribe(
        (response) => {
          console.log('Health tip updated successfully:', response);
          this.router.navigate(['/admin-health-tips']); // Navigate back to the health tips list
        },
        (error) => {
          console.error('Error updating health tip:', error);
        }
      );
    } else {
      // Prepare CreateHealthTipDTO for a new health tip
      const createHealthTipDTO: CreateHealthTipDTO = {
        TipTitle: this.healthTip.TipTitle,
        TipDescription: this.healthTip.TipDescription,
        CategoryId: this.healthTip.CategoryId,
        HealthTipsimg: this.healthTip.HealthTipsimg, // Health tip image is optional
      };

      // Call add service method
      this.healthTipsService.addHealthTip(createHealthTipDTO).subscribe(
        (response: ReadHealthTipDTO) => {
          console.log('Health tip added successfully:', response);
          this.router.navigate(['/admin-health-tips']); // Navigate back to the health tips list
        },
        (error) => {
          console.error('Error adding health tip:', error);
        }
      );
    }
  }

  // Handle file input changes (for health tip image)
  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.healthTip.HealthTipsimg = file; // Set the selected image file to healthTip
    }
  }
}
