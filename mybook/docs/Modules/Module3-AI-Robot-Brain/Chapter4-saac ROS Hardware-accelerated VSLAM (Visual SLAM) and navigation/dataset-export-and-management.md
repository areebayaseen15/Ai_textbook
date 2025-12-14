---
id: dataset-export-and-management
title: dataset export and management
sidebar_label: dataset export and management
sidebar_position: 0
---
# 3.3.5 Dataset Export and Management

Dataset export and management form the final critical component of the synthetic data generation pipeline in Isaac Sim. This chapter covers the processes of converting synthetic data into standard formats, organizing large datasets, implementing versioning systems, and establishing quality control measures that ensure datasets are ready for machine learning applications.

## Dataset Format Conversion

### Standard Dataset Formats

Isaac Sim synthetic data needs to be converted to standard formats for compatibility with machine learning frameworks and tools. The most common formats include:

**COCO (Common Objects in Context)**: The most popular format for object detection, segmentation, and keypoint detection tasks.

**KITTI**: Commonly used for autonomous driving and 3D object detection tasks.

**Pascal VOC**: Traditional format for object detection and classification.

**TFRecord**: TensorFlow's binary format for efficient data loading.

**Yolo**: Simple text-based format popular for real-time object detection.

### COCO Format Export

```python
# Example: COCO format export from Isaac Sim synthetic data
import json
import os
from datetime import datetime
import numpy as np
from PIL import Image

class COCOExporter:
    def __init__(self, output_dir):
        self.output_dir = output_dir
        self.images_dir = os.path.join(output_dir, "images")
        self.annotations_dir = os.path.join(output_dir, "annotations")

        # Create directories
        os.makedirs(self.images_dir, exist_ok=True)
        os.makedirs(self.annotations_dir, exist_ok=True)

    def export_dataset(self, synthetic_data, dataset_name="synthetic_dataset"):
        """Export synthetic data to COCO format"""

        # Initialize COCO structure
        coco_data = {
            "info": self._create_info(dataset_name),
            "licenses": self._create_licenses(),
            "categories": self._create_categories(),
            "images": [],
            "annotations": []
        }

        # Process each sample
        annotation_id = 1
        for sample_idx, sample in enumerate(synthetic_data):
            # Add image information
            image_info = self._create_image_info(sample, sample_idx)
            coco_data["images"].append(image_info)

            # Add annotations for this image
            for obj in sample.get("objects", []):
                annotation = self._create_annotation(
                    obj, sample_idx, annotation_id
                )
                coco_data["annotations"].append(annotation)
                annotation_id += 1

            # Save image
            self._save_image(sample["rgb_image"], sample_idx)

        # Save COCO annotation file
        self._save_coco_annotations(coco_data, dataset_name)

        return coco_data

    def _create_info(self, dataset_name):
        """Create dataset info section"""
        return {
            "description": f"Synthetic dataset generated with Isaac Sim: {dataset_name}",
            "url": "https://developer.nvidia.com/isaac-sim",
            "version": "1.0",
            "year": datetime.now().year,
            "contributor": "Isaac Sim Synthetic Data Generator",
            "date_created": datetime.now().strftime("%Y/%m/%d")
        }

    def _create_licenses(self):
        """Create license information"""
        return [{
            "id": 1,
            "name": "Synthetic Data License",
            "url": "https://nvidia.com/license"
        }]

    def _create_categories(self):
        """Create category definitions"""
        # Define your object categories here
        categories = [
            {"id": 1, "name": "car", "supercategory": "vehicle"},
            {"id": 2, "name": "pedestrian", "supercategory": "person"},
            {"id": 3, "name": "bicycle", "supercategory": "vehicle"},
            {"id": 4, "name": "traffic_sign", "supercategory": "infrastructure"},
            {"id": 5, "name": "tree", "supercategory": "vegetation"},
            # Add more categories as needed
        ]
        return categories

    def _create_image_info(self, sample, image_id):
        """Create image information entry"""
        img = sample["rgb_image"]
        height, width = img.shape[:2] if isinstance(img, np.ndarray) else (480, 640)

        return {
            "id": image_id,
            "width": width,
            "height": height,
            "file_name": f"{image_id:06d}.jpg",
            "license": 1,
            "flickr_url": "",
            "coco_url": "",
            "date_captured": sample.get("timestamp", datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
        }

    def _create_annotation(self, obj, image_id, annotation_id):
        """Create annotation entry for an object"""
        # Calculate bounding box
        bbox = self._calculate_bbox(obj)

        # Calculate area
        area = bbox[2] * bbox[3]  # width * height

        # Create segmentation (polygon format)
        segmentation = self._create_segmentation(obj)

        return {
            "id": annotation_id,
            "image_id": image_id,
            "category_id": obj["category_id"],
            "segmentation": segmentation,
            "area": area,
            "bbox": bbox,
            "iscrowd": 0,
            "keypoints": obj.get("keypoints", []),
            "num_keypoints": len(obj.get("keypoints", [])) // 3 if obj.get("keypoints") else 0
        }

    def _calculate_bbox(self, obj):
        """Calculate bounding box from object information"""
        if "bbox" in obj:
            return obj["bbox"]

        # If bbox not provided, calculate from mask or 3D info
        # This is a simplified implementation
        return [obj.get("x", 0), obj.get("y", 0),
                obj.get("width", 50), obj.get("height", 50)]

    def _create_segmentation(self, obj):
        """Create segmentation polygon from object"""
        # For synthetic data, we might have precise segmentation
        # This is a simplified implementation
        if "segmentation_polygon" in obj:
            return [obj["segmentation_polygon"]]
        else:
            # Create bounding box based segmentation
            x, y, w, h = self._calculate_bbox(obj)
            return [[x, y, x+w, y, x+w, y+h, x, y+h]]

    def _save_image(self, image, image_id):
        """Save image to disk"""
        image_path = os.path.join(self.images_dir, f"{image_id:06d}.jpg")

        if isinstance(image, np.ndarray):
            img = Image.fromarray(image.astype('uint8'))
            img.save(image_path, quality=95)
        else:
            # Assume it's already a file path
            import shutil
            shutil.copy(image, image_path)

    def _save_coco_annotations(self, coco_data, dataset_name):
        """Save COCO annotations to JSON file"""
        annotation_path = os.path.join(
            self.annotations_dir,
            f"instances_{dataset_name}.json"
        )

        with open(annotation_path, 'w') as f:
            json.dump(coco_data, f, indent=2)

# Usage example
exporter = COCOExporter("./output/coco_dataset")
# coco_dataset = exporter.export_dataset(synthetic_data, "warehouse_robots")
```

### KITTI Format Export

```python
class KITTIExporter:
    def __init__(self, output_dir):
        self.output_dir = output_dir
        self.image_dir = os.path.join(output_dir, "image_2")
        self.label_dir = os.path.join(output_dir, "label_2")
        self.calib_dir = os.path.join(output_dir, "calib")

        # Create directories
        os.makedirs(self.image_dir, exist_ok=True)
        os.makedirs(self.label_dir, exist_ok=True)
        os.makedirs(self.calib_dir, exist_ok=True)

    def export_dataset(self, synthetic_data):
        """Export to KITTI format"""

        for sample_idx, sample in enumerate(synthetic_data):
            # Save image
            self._save_image(sample["rgb_image"], sample_idx)

            # Save labels
            self._save_labels(sample.get("objects", []), sample_idx)

            # Save calibration
            self._save_calibration(sample.get("camera_params", {}), sample_idx)

    def _save_labels(self, objects, sample_idx):
        """Save KITTI format labels"""
        label_path = os.path.join(self.label_dir, f"{sample_idx:06d}.txt")

        with open(label_path, 'w') as f:
            for obj in objects:
                # KITTI format: type, truncated, occluded, alpha, bbox, dimensions, location, rotation_y
                kitti_line = [
                    obj.get("class_name", "DontCare"),
                    f"{obj.get('truncated', 0.0):.2f}",
                    f"{obj.get('occluded', 0)}",
                    f"{obj.get('alpha', -10):.2f}",
                    # Bounding box (left, top, right, bottom)
                    f"{obj['bbox'][0]:.2f}",
                    f"{obj['bbox'][1]:.2f}",
                    f"{obj['bbox'][0] + obj['bbox'][2]:.2f}",
                    f"{obj['bbox'][1] + obj['bbox'][3]:.2f}",
                    # Dimensions (height, width, length)
                    f"{obj.get('dimensions', [0, 0, 0])[0]:.2f}",
                    f"{obj.get('dimensions', [0, 0, 0])[1]:.2f}",
                    f"{obj.get('dimensions', [0, 0, 0])[2]:.2f}",
                    # Location (x, y, z)
                    f"{obj.get('location', [0, 0, 0])[0]:.2f}",
                    f"{obj.get('location', [0, 0, 0])[1]:.2f}",
                    f"{obj.get('location', [0, 0, 0])[2]:.2f}",
                    # Rotation around Y axis
                    f"{obj.get('rotation_y', 0):.2f}"
                ]

                f.write(" ".join(kitti_line) + "\n")

    def _save_calibration(self, camera_params, sample_idx):
        """Save calibration parameters"""
        calib_path = os.path.join(self.calib_dir, f"{sample_idx:06d}.txt")

        # Default calibration matrix for a typical camera
        calib_matrix = camera_params.get("p_rect_00", [
            721.5377, 0.0, 609.5593, 0.0,
            0.0, 721.5377, 172.854, 0.0,
            0.0, 0.0, 1.0, 0.0
        ])

        with open(calib_path, 'w') as f:
            f.write(f"P0: {' '.join(map(str, calib_matrix))}\n")
            f.write(f"P1: {' '.join(map(str, calib_matrix))}\n")
            f.write(f"P2: {' '.join(map(str, calib_matrix))}\n")
            f.write(f"P3: {' '.join(map(str, calib_matrix))}\n")
```

### YOLO Format Export

```python
class YOLOExporter:
    def __init__(self, output_dir):
        self.output_dir = output_dir
        self.images_dir = os.path.join(output_dir, "images")
        self.labels_dir = os.path.join(output_dir, "labels")

        os.makedirs(self.images_dir, exist_ok=True)
        os.makedirs(self.labels_dir, exist_ok=True)

    def export_dataset(self, synthetic_data, class_mapping):
        """Export to YOLO format"""

        for sample_idx, sample in enumerate(synthetic_data):
            # Save image
            self._save_image(sample["rgb_image"], sample_idx)

            # Save YOLO format labels
            self._save_yolo_labels(
                sample.get("objects", []),
                sample_idx,
                sample["rgb_image"].shape[1],  # width
                sample["rgb_image"].shape[0],  # height
                class_mapping
            )

    def _save_yolo_labels(self, objects, sample_idx, img_width, img_height, class_mapping):
        """Save labels in YOLO format (normalized coordinates)"""
        label_path = os.path.join(self.labels_dir, f"{sample_idx:06d}.txt")

        with open(label_path, 'w') as f:
            for obj in objects:
                class_id = class_mapping.get(obj["class_name"], 0)

                # Convert bbox to YOLO format (normalized center x, center y, width, height)
                x_min, y_min, width, height = obj["bbox"]
                x_center = (x_min + width / 2) / img_width
                y_center = (y_min + height / 2) / img_height
                norm_width = width / img_width
                norm_height = height / img_height

                # YOLO format: class_id center_x center_y width height
                f.write(f"{class_id} {x_center:.6f} {y_center:.6f} {norm_width:.6f} {norm_height:.6f}\n")
```

## Data Versioning Strategies

### Git-Based Versioning

For smaller datasets, Git can be used with Git LFS for versioning:

```python
import subprocess
import os
from datetime import datetime

class GitDatasetVersioner:
    def __init__(self, dataset_dir):
        self.dataset_dir = dataset_dir
        self.original_dir = os.getcwd()

    def initialize_repo(self):
        """Initialize a Git repository for the dataset"""
        os.chdir(self.dataset_dir)

        # Initialize git repo
        subprocess.run(["git", "init"], check=True)

        # Configure Git LFS for large files
        subprocess.run(["git", "lfs", "install"], check=True)

        # Track common large file types
        lfs_extensions = [
            "*.jpg", "*.jpeg", "*.png", "*.tiff", "*.tif",
            "*.bin", "*.ply", "*.pcd", "*.bag",
            "*.mp4", "*.avi", "*.mov"
        ]

        for ext in lfs_extensions:
            subprocess.run(["git", "lfs", "track", ext], check=True)

        # Create .gitattributes
        with open(".gitattributes", "a") as f:
            f.write("\n# Dataset tracking\n")

        os.chdir(self.original_dir)

    def create_version(self, version_name, commit_message):
        """Create a new version of the dataset"""
        os.chdir(self.dataset_dir)

        # Add all files
        subprocess.run(["git", "add", "."], check=True)

        # Create commit
        subprocess.run(["git", "commit", "-m", f"{commit_message} - {version_name}"], check=True)

        # Create tag
        subprocess.run(["git", "tag", "-a", version_name, "-m", commit_message], check=True)

        os.chdir(self.original_dir)

    def list_versions(self):
        """List all available versions"""
        os.chdir(self.dataset_dir)
        result = subprocess.run(["git", "tag"], capture_output=True, text=True)
        os.chdir(self.original_dir)

        return result.stdout.strip().split('\n') if result.stdout.strip() else []
```

### DVC (Data Version Control)

For larger datasets, DVC provides better handling:

```python
class DVCDatasetManager:
    def __init__(self, dataset_dir):
        self.dataset_dir = dataset_dir
        self.original_dir = os.getcwd()

    def setup_dvc(self):
        """Set up DVC for the dataset"""
        os.chdir(self.dataset_dir)

        # Initialize DVC
        subprocess.run(["dvc", "init"], check=True)

        # Configure remote storage (example with S3)
        # subprocess.run(["dvc", "remote", "add", "-d", "myremote", "s3://mybucket/datasets"], check=True)

        os.chdir(self.original_dir)

    def add_dataset_files(self, file_patterns):
        """Add dataset files to DVC tracking"""
        os.chdir(self.dataset_dir)

        for pattern in file_patterns:
            subprocess.run(["dvc", "add", pattern], check=True)

        # Add DVC files to git
        subprocess.run(["git", "add", "."], check=True)
        subprocess.run(["git", "commit", "-m", "Add dataset files with DVC"], check=True)

        os.chdir(self.original_dir)

    def push_to_remote(self):
        """Push dataset to remote storage"""
        os.chdir(self.dataset_dir)
        subprocess.run(["dvc", "push"], check=True)
        os.chdir(self.original_dir)

    def pull_from_remote(self):
        """Pull dataset from remote storage"""
        os.chdir(self.dataset_dir)
        subprocess.run(["dvc", "pull"], check=True)
        os.chdir(self.original_dir)
```

### Custom Dataset Versioning System

For specialized needs, a custom versioning system:

```python
import json
import hashlib
from pathlib import Path

class CustomDatasetVersioner:
    def __init__(self, dataset_dir):
        self.dataset_dir = Path(dataset_dir)
        self.versions_dir = self.dataset_dir / ".versions"
        self.versions_dir.mkdir(exist_ok=True)

    def create_version(self, version_name, description=""):
        """Create a new dataset version with metadata"""

        # Calculate dataset hash
        dataset_hash = self._calculate_dataset_hash()

        # Create version metadata
        version_info = {
            "version": version_name,
            "description": description,
            "created_at": datetime.now().isoformat(),
            "dataset_hash": dataset_hash,
            "file_count": self._count_files(),
            "total_size": self._calculate_total_size(),
            "metadata": self._extract_metadata()
        }

        # Save version info
        version_file = self.versions_dir / f"{version_name}.json"
        with open(version_file, 'w') as f:
            json.dump(version_info, f, indent=2)

        return version_info

    def _calculate_dataset_hash(self):
        """Calculate hash of entire dataset"""
        hasher = hashlib.sha256()

        for file_path in self.dataset_dir.rglob("*"):
            if file_path.is_file() and not str(file_path).startswith(str(self.versions_dir)):
                with open(file_path, 'rb') as f:
                    while chunk := f.read(8192):
                        hasher.update(chunk)

        return hasher.hexdigest()

    def _count_files(self):
        """Count total number of files in dataset"""
        count = 0
        for file_path in self.dataset_dir.rglob("*"):
            if file_path.is_file() and not str(file_path).startswith(str(self.versions_dir)):
                count += 1
        return count

    def _calculate_total_size(self):
        """Calculate total size of dataset"""
        total_size = 0
        for file_path in self.dataset_dir.rglob("*"):
            if file_path.is_file() and not str(file_path).startswith(str(self.versions_dir)):
                total_size += file_path.stat().st_size
        return total_size

    def _extract_metadata(self):
        """Extract metadata from dataset"""
        metadata = {
            "image_formats": [],
            "annotation_formats": [],
            "class_distribution": {},
            "scene_types": []
        }

        # Analyze file extensions
        formats = {}
        for file_path in self.dataset_dir.rglob("*"):
            if file_path.is_file():
                ext = file_path.suffix.lower()
                formats[ext] = formats.get(ext, 0) + 1

        metadata["file_formats"] = formats

        return metadata

    def list_versions(self):
        """List all available versions"""
        versions = []
        for version_file in self.versions_dir.glob("*.json"):
            with open(version_file) as f:
                version_info = json.load(f)
                versions.append(version_info)

        # Sort by creation date
        versions.sort(key=lambda x: x["created_at"], reverse=True)
        return versions
```

## Dataset Quality Validation

### Quality Metrics and Validation

```python
class DatasetQualityValidator:
    def __init__(self):
        self.metrics = {}

    def validate_dataset(self, dataset_path, expected_format="coco"):
        """Validate the quality of a dataset"""

        validation_results = {
            "overall_score": 0.0,
            "completeness": 0.0,
            "consistency": 0.0,
            "accuracy": 0.0,
            "diversity": 0.0,
            "issues": [],
            "recommendations": []
        }

        if expected_format == "coco":
            validation_results.update(self._validate_coco_dataset(dataset_path))
        elif expected_format == "kitti":
            validation_results.update(self._validate_kitti_dataset(dataset_path))
        elif expected_format == "yolo":
            validation_results.update(self._validate_yolo_dataset(dataset_path))

        # Calculate overall score
        validation_results["overall_score"] = (
            validation_results["completeness"] * 0.3 +
            validation_results["consistency"] * 0.3 +
            validation_results["accuracy"] * 0.2 +
            validation_results["diversity"] * 0.2
        )

        return validation_results

    def _validate_coco_dataset(self, dataset_path):
        """Validate COCO format dataset"""
        import json

        results = {
            "completeness": 0.0,
            "consistency": 0.0,
            "accuracy": 0.0,
            "diversity": 0.0,
            "issues": [],
            "recommendations": []
        }

        # Load COCO annotation file
        annotation_files = list(Path(dataset_path).glob("annotations/*.json"))
        if not annotation_files:
            results["issues"].append("No annotation files found")
            return results

        with open(annotation_files[0]) as f:
            coco_data = json.load(f)

        # Validate structure
        required_keys = ["images", "annotations", "categories"]
        for key in required_keys:
            if key not in coco_data:
                results["issues"].append(f"Missing required key: {key}")

        # Check completeness
        if "images" in coco_data and "annotations" in coco_data:
            image_count = len(coco_data["images"])
            annotation_count = len(coco_data["annotations"])

            if image_count > 0:
                results["completeness"] = min(1.0, annotation_count / image_count)
            else:
                results["completeness"] = 0.0

        # Check consistency
        if "categories" in coco_data:
            category_ids = {cat["id"] for cat in coco_data["categories"]}
            annotation_categories = {ann["category_id"] for ann in coco_data["annotations"]}

            missing_categories = annotation_categories - category_ids
            if missing_categories:
                results["issues"].append(f"Annotations reference non-existent categories: {missing_categories}")

            results["consistency"] = 1.0 if not missing_categories else 0.8

        # Check diversity
        if "annotations" in coco_data:
            category_distribution = {}
            for ann in coco_data["annotations"]:
                cat_id = ann["category_id"]
                category_distribution[cat_id] = category_distribution.get(cat_id, 0) + 1

            if category_distribution:
                # Calculate entropy as diversity measure
                total_annotations = sum(category_distribution.values())
                entropy = 0
                for count in category_distribution.values():
                    p = count / total_annotations
                    entropy -= p * (p and math.log2(p))

                max_entropy = math.log2(len(category_distribution))
                results["diversity"] = entropy / max_entropy if max_entropy > 0 else 0.0

        return results

    def _validate_image_quality(self, image_path):
        """Validate individual image quality"""
        from PIL import Image
        import numpy as np

        try:
            with Image.open(image_path) as img:
                # Check if image can be opened
                width, height = img.size
                mode = img.mode

                quality_metrics = {
                    "width": width,
                    "height": height,
                    "mode": mode,
                    "size_bytes": os.path.getsize(image_path),
                    "is_corrupted": False
                }

                # Check for common issues
                if width < 10 or height < 10:
                    quality_metrics["issues"] = ["Image too small"]
                elif width > 10000 or height > 10000:
                    quality_metrics["issues"] = ["Image too large"]
                else:
                    quality_metrics["issues"] = []

                return quality_metrics

        except Exception as e:
            return {
                "is_corrupted": True,
                "error": str(e),
                "issues": ["Corrupted image file"]
            }

    def generate_quality_report(self, validation_results, output_path):
        """Generate a comprehensive quality report"""

        report = {
            "timestamp": datetime.now().isoformat(),
            "validation_results": validation_results,
            "summary": self._generate_summary(validation_results),
            "detailed_analysis": self._generate_detailed_analysis(validation_results)
        }

        with open(output_path, 'w') as f:
            json.dump(report, f, indent=2)

        return report

    def _generate_summary(self, results):
        """Generate a summary of validation results"""
        return {
            "overall_score": f"{results['overall_score']:.2f}",
            "status": "PASS" if results['overall_score'] > 0.8 else "FAIL",
            "main_issues": results.get('issues', [])[:5],  # Top 5 issues
            "recommendations_count": len(results.get('recommendations', []))
        }

    def _generate_detailed_analysis(self, results):
        """Generate detailed analysis"""
        return {
            "completeness_analysis": f"Completeness score: {results['completeness']:.2f}",
            "consistency_analysis": f"Consistency score: {results['consistency']:.2f}",
            "accuracy_analysis": f"Accuracy score: {results['accuracy']:.2f}",
            "diversity_analysis": f"Diversity score: {results['diversity']:.2f}",
            "all_issues": results.get('issues', []),
            "all_recommendations": results.get('recommendations', [])
        }
```

### Automated Quality Assurance Pipeline

```python
class QualityAssurancePipeline:
    def __init__(self, dataset_path, format_type="coco"):
        self.dataset_path = dataset_path
        self.format_type = format_type
        self.validator = DatasetQualityValidator()

    def run_complete_qa(self):
        """Run complete quality assurance pipeline"""

        print("Starting Quality Assurance Pipeline...")

        # Step 1: Basic validation
        print("Step 1: Basic validation")
        basic_results = self._basic_validation()

        # Step 2: Format-specific validation
        print("Step 2: Format-specific validation")
        format_results = self._format_specific_validation()

        # Step 3: Image quality validation
        print("Step 3: Image quality validation")
        image_results = self._image_quality_validation()

        # Step 4: Annotation quality validation
        print("Step 4: Annotation quality validation")
        annotation_results = self._annotation_quality_validation()

        # Step 5: Generate comprehensive report
        print("Step 5: Generating report")
        final_results = self._combine_results(
            basic_results, format_results,
            image_results, annotation_results
        )

        # Step 6: Create quality report
        report = self.validator.generate_quality_report(
            final_results,
            f"{self.dataset_path}/quality_report.json"
        )

        print("Quality Assurance Pipeline completed!")
        return report

    def _basic_validation(self):
        """Perform basic validation checks"""
        results = {
            "directory_structure": self._validate_directory_structure(),
            "file_integrity": self._validate_file_integrity(),
            "basic_stats": self._calculate_basic_stats()
        }
        return results

    def _validate_directory_structure(self):
        """Validate expected directory structure"""
        expected_dirs = {
            "coco": ["images", "annotations"],
            "kitti": ["image_2", "label_2", "calib"],
            "yolo": ["images", "labels"]
        }

        required_dirs = expected_dirs.get(self.format_type, [])
        present_dirs = []
        missing_dirs = []

        for dir_name in required_dirs:
            dir_path = Path(self.dataset_path) / dir_name
            if dir_path.exists() and dir_path.is_dir():
                present_dirs.append(dir_name)
            else:
                missing_dirs.append(dir_name)

        return {
            "present_dirs": present_dirs,
            "missing_dirs": missing_dirs,
            "structure_valid": len(missing_dirs) == 0
        }

    def _validate_file_integrity(self):
        """Validate file integrity"""
        import hashlib

        files_to_check = list(Path(self.dataset_path).rglob("*"))
        corrupted_files = []
        valid_files = 0

        for file_path in files_to_check:
            if file_path.is_file():
                try:
                    # Try to open and read file
                    with open(file_path, 'rb') as f:
                        f.read(1024)  # Read first 1KB to check if file is accessible
                    valid_files += 1
                except Exception:
                    corrupted_files.append(str(file_path))

        return {
            "total_files": len(files_to_check),
            "valid_files": valid_files,
            "corrupted_files": corrupted_files,
            "integrity_score": valid_files / len(files_to_check) if files_to_check else 0
        }

    def _calculate_basic_stats(self):
        """Calculate basic dataset statistics"""
        total_size = 0
        file_count = 0
        image_count = 0
        annotation_count = 0

        for file_path in Path(self.dataset_path).rglob("*"):
            if file_path.is_file():
                total_size += file_path.stat().st_size
                file_count += 1

                if file_path.suffix.lower() in ['.jpg', '.jpeg', '.png', '.bmp', '.tiff']:
                    image_count += 1
                elif file_path.suffix.lower() in ['.json', '.txt', '.xml']:
                    annotation_count += 1

        return {
            "total_size_mb": total_size / (1024 * 1024),
            "total_files": file_count,
            "image_files": image_count,
            "annotation_files": annotation_count
        }
```

## Storage and Organization Best Practices

### Hierarchical Dataset Organization

```python
class DatasetOrganizer:
    def __init__(self, base_path):
        self.base_path = Path(base_path)

    def create_standard_structure(self, dataset_name, task_type="detection"):
        """Create standard dataset directory structure"""

        # Create main dataset directory
        dataset_dir = self.base_path / dataset_name
        dataset_dir.mkdir(exist_ok=True)

        # Create standard structure based on task type
        if task_type == "detection":
            structure = {
                "images": ["train", "val", "test"],
                "annotations": ["train", "val", "test"],
                "splits": [],
                "metadata": [],
                "docs": []
            }
        elif task_type == "segmentation":
            structure = {
                "images": ["train", "val", "test"],
                "masks": ["train", "val", "test"],
                "annotations": ["train", "val", "test"],
                "splits": [],
                "metadata": [],
                "docs": []
            }
        elif task_type == "depth_estimation":
            structure = {
                "rgb": ["train", "val", "test"],
                "depth": ["train", "val", "test"],
                "annotations": ["train", "val", "test"],
                "splits": [],
                "metadata": [],
                "docs": []
            }

        # Create directory structure
        for main_dir, sub_dirs in structure.items():
            main_path = dataset_dir / main_dir
            main_path.mkdir(exist_ok=True)

            for sub_dir in sub_dirs:
                sub_path = main_path / sub_dir
                sub_path.mkdir(exist_ok=True)

        # Create metadata files
        self._create_metadata_files(dataset_dir)

        return dataset_dir

    def _create_metadata_files(self, dataset_dir):
        """Create standard metadata files"""

        # Create README
        readme_path = dataset_dir / "README.md"
        readme_content = f"""# {dataset_dir.name} Dataset

## Overview
This dataset was generated using NVIDIA Isaac Sim for synthetic data generation.

## Structure
- `images/` - Contains RGB images
- `annotations/` - Contains annotation files
- `splits/` - Contains train/validation/test splits
- `metadata/` - Contains dataset metadata

## Statistics
- Total images:
- Total annotations:
- Classes:
- Generated on: {datetime.now().strftime('%Y-%m-%d')}

## License
Synthetic data license - freely usable for research and commercial purposes.
"""

        with open(readme_path, 'w') as f:
            f.write(readme_content)

        # Create dataset info
        info_path = dataset_dir / "dataset_info.json"
        info_data = {
            "name": dataset_dir.name,
            "type": "synthetic",
            "generator": "NVIDIA Isaac Sim",
            "created_date": datetime.now().isoformat(),
            "version": "1.0",
            "description": f"Synthetic dataset for {dataset_dir.name}",
            "statistics": {},
            "license": "Synthetic Data License"
        }

        with open(info_path, 'w') as f:
            json.dump(info_data, f, indent=2)

    def organize_by_scene_type(self, dataset_dir, synthetic_data):
        """Organize dataset by scene types"""

        # Determine scene types from synthetic data
        scene_types = set()
        for sample in synthetic_data:
            scene_type = sample.get("scene_type", "unknown")
            scene_types.add(scene_type)

        # Create scene type subdirectories
        for scene_type in scene_types:
            for split in ["train", "val", "test"]:
                scene_dir = dataset_dir / "images" / split / scene_type
                scene_dir.mkdir(parents=True, exist_ok=True)

                # Move files to appropriate scene directories
                # This would be implemented based on your specific organization needs
```

### Efficient Storage Strategies

```python
import zipfile
import tarfile
from concurrent.futures import ThreadPoolExecutor
import multiprocessing as mp

class EfficientStorageManager:
    def __init__(self, dataset_path):
        self.dataset_path = Path(dataset_path)

    def compress_dataset(self, output_path, compression_type="zip", max_workers=4):
        """Compress dataset using parallel processing"""

        if compression_type == "zip":
            return self._compress_zip(output_path, max_workers)
        elif compression_type == "tar":
            return self._compress_tar(output_path, max_workers)
        else:
            raise ValueError(f"Unsupported compression type: {compression_type}")

    def _compress_zip(self, output_path, max_workers):
        """Compress dataset to ZIP format"""

        def add_file_to_zip(zip_file, file_path, arc_path):
            """Add a single file to ZIP archive"""
            zip_file.write(file_path, arc_path, zipfile.ZIP_DEFLATED)

        with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as zip_file:
            all_files = list(self.dataset_path.rglob("*"))
            total_files = len(all_files)

            print(f"Compressing {total_files} files...")

            for i, file_path in enumerate(all_files):
                if file_path.is_file():
                    # Calculate archive path (relative to dataset path)
                    arc_path = file_path.relative_to(self.dataset_path)
                    add_file_to_zip(zip_file, file_path, str(arc_path))

                    if i % 1000 == 0:
                        print(f"Progress: {i}/{total_files} files compressed")

        print(f"Dataset compressed to {output_path}")
        return output_path

    def optimize_image_storage(self, quality=95, target_format="JPEG"):
        """Optimize image storage by compressing images"""

        image_extensions = {'.jpg', '.jpeg', '.png', '.bmp', '.tiff'}
        optimized_count = 0

        for file_path in self.dataset_path.rglob("*"):
            if file_path.suffix.lower() in image_extensions:
                try:
                    with Image.open(file_path) as img:
                        # Convert to target format if needed
                        if target_format and img.format != target_format:
                            # Create new filename with target extension
                            new_path = file_path.with_suffix(f'.{target_format.lower()}')
                            img.save(new_path, target_format, quality=quality, optimize=True)

                            # Remove original if different
                            if new_path != file_path:
                                file_path.unlink()
                        else:
                            # Just optimize existing image
                            img.save(file_path, optimize=True, quality=quality)

                        optimized_count += 1

                        if optimized_count % 100 == 0:
                            print(f"Optimized {optimized_count} images...")

                except Exception as e:
                    print(f"Error optimizing {file_path}: {e}")

        print(f"Optimized {optimized_count} images")
        return optimized_count

    def create_dataset_manifest(self):
        """Create a manifest file for the dataset"""

        manifest = {
            "dataset_path": str(self.dataset_path),
            "created_at": datetime.now().isoformat(),
            "total_files": 0,
            "total_size": 0,
            "file_types": {},
            "structure": {},
            "checksums": {}
        }

        file_types = {}
        total_size = 0
        total_files = 0

        for file_path in self.dataset_path.rglob("*"):
            if file_path.is_file():
                # Update file type counts
                ext = file_path.suffix.lower()
                file_types[ext] = file_types.get(ext, 0) + 1

                # Update size
                size = file_path.stat().st_size
                total_size += size

                # Calculate checksum
                with open(file_path, 'rb') as f:
                    file_hash = hashlib.md5(f.read()).hexdigest()

                manifest["checksums"][str(file_path.relative_to(self.dataset_path))] = file_hash
                total_files += 1

        manifest["total_files"] = total_files
        manifest["total_size"] = total_size
        manifest["file_types"] = file_types

        # Save manifest
        manifest_path = self.dataset_path / "dataset_manifest.json"
        with open(manifest_path, 'w') as f:
            json.dump(manifest, f, indent=2)

        print(f"Dataset manifest created: {manifest_path}")
        return manifest_path
```

## Exercises

1. **Exercise 1**: Create a complete dataset export pipeline that converts Isaac Sim synthetic data to COCO, KITTI, and YOLO formats, including proper versioning and quality validation.

2. **Exercise 2**: Implement a dataset quality validation system that checks for annotation completeness, image quality, and format compliance.

3. **Exercise 3**: Design a hierarchical dataset organization system that categorizes synthetic data by scene type, object class, and environmental conditions.

4. **Exercise 4**: Build a dataset management system with compression, manifest generation, and integrity verification capabilities.

## Best Practices

### Dataset Management Best Practices

1. **Standard Formats**: Always export to standard formats (COCO, KITTI, etc.) for compatibility
2. **Version Control**: Implement proper versioning for dataset iterations
3. **Quality Validation**: Validate datasets before making them available for training
4. **Metadata Documentation**: Include comprehensive metadata with each dataset
5. **Storage Optimization**: Optimize storage through compression and efficient formats

### Export Pipeline Best Practices

1. **Modular Design**: Create modular export components for different formats
2. **Validation Integration**: Include validation in the export pipeline
3. **Error Handling**: Implement comprehensive error handling and recovery
4. **Progress Tracking**: Provide progress feedback during export operations
5. **Consistency Checks**: Verify exported data maintains consistency with source

## Conclusion

Dataset export and management represent the crucial final stage of the synthetic data generation pipeline in Isaac Sim. Proper export to standard formats ensures compatibility with machine learning frameworks, while effective versioning and quality validation systems maintain dataset integrity and usability.

The combination of format conversion, version control, quality assurance, and storage optimization creates a robust pipeline that transforms synthetic data from Isaac Sim into production-ready datasets for robotics applications. These systems ensure that the high-quality synthetic data generated in Isaac Sim can be effectively utilized in real-world machine learning workflows.

As we continue through this module, we'll explore how these exported datasets integrate with the broader Isaac ROS ecosystem and how they enable the development of robust perception systems for humanoid robots. The comprehensive approach to dataset management ensures that synthetic data can be effectively leveraged to accelerate robotics development and research.