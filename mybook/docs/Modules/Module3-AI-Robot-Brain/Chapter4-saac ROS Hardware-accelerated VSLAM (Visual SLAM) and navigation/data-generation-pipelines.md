---
id: data-generation-pipelines
title: data generation pipelines
sidebar_label: data generation pipelines
sidebar_position: 0
---
# 3.3.2 Data Generation Pipelines

Data generation pipelines in Isaac Sim provide the infrastructure needed to systematically create large-scale synthetic datasets with consistent quality and comprehensive annotations. These pipelines integrate scene generation, rendering, annotation, and post-processing to create production-ready datasets for robotics applications.

## Pipeline Architecture Overview

### Core Components

A comprehensive synthetic data generation pipeline consists of several interconnected components:

**Scene Generator**: Creates diverse and realistic scenes with appropriate objects, lighting, and environmental conditions
**Renderer**: Performs photorealistic rendering with accurate physics simulation
**Annotation Engine**: Generates comprehensive ground truth annotations
**Quality Controller**: Validates and ensures data quality
**Storage Manager**: Handles efficient storage and retrieval of large datasets
**Task Manager**: Coordinates pipeline execution and resource allocation

### Pipeline Workflow

The typical workflow follows this sequence:

1. **Configuration**: Define generation parameters and requirements
2. **Scene Generation**: Create diverse scenes with randomization
3. **Rendering**: Generate images and sensor data
4. **Annotation**: Create ground truth labels and metadata
5. **Validation**: Check data quality and consistency
6. **Storage**: Efficiently store processed data
7. **Indexing**: Create indices for efficient retrieval

### Scalability Considerations

Modern pipelines must scale to generate millions of images:

```python
# Example: Scalable pipeline configuration
pipeline_config = {
    "batch_size": 32,
    "parallel_rendering": True,
    "gpu_rendering": True,
    "distributed_execution": True,
    "storage_compression": "png_16bit",  # or other compression
    "output_format": "coco",  # or kitti, nuscenes, etc.
    "annotation_types": [
        "2d_bounding_box",
        "3d_bounding_box",
        "semantic_segmentation",
        "instance_segmentation",
        "depth_map",
        "optical_flow"
    ]
}
```

## Replicator API for Randomization

Isaac Sim's Replicator API provides powerful tools for systematic scene randomization and synthetic data generation.

### Basic Replicator Setup

```python
# Example: Basic Replicator setup for synthetic data generation
import omni.replicator.core as rep

def setup_replicator_pipeline():
    """Set up the basic Replicator pipeline"""

    # Initialize Replicator
    rep.orchestrator.setup()

    # Define randomization functions
    def randomize_lighting():
        with rep.randomizer:
            lights = rep.get.light()
            with lights:
                rep.modify.pose(
                    position=rep.distribution.uniform((-5, 5), (-5, 5), (2, 10)),
                    rotation=rep.distribution.uniform((0, 0, 0), (360, 360, 360))
                )
                rep.light.intensity(rep.distribution.normal(1000, 200))
                rep.light.color(rep.distribution.uniform((0.8, 0.8, 0.8), (1.2, 1.2, 1.2)))
        return lights.node

    def randomize_objects():
        with rep.randomizer:
            objects = rep.get.prims(path_pattern="/World/Objects/*")
            with objects:
                rep.modify.pose(
                    position=rep.distribution.uniform((-10, 0, -10), (10, 2, 10)),
                    rotation=rep.distribution.uniform((0, 0, 0), (360, 360, 360))
                )
        return objects.node

    return randomize_lighting, randomize_objects
```

### Advanced Randomization Techniques

```python
def advanced_domain_randomization():
    """Implement advanced domain randomization techniques"""

    # Material randomization
    def randomize_materials():
        with rep.randomizer:
            prims = rep.get.prims(path_pattern="/World/*")
            with prims:
                # Randomize albedo
                albedo_values = [
                    (0.8, 0.1, 0.1),  # Red
                    (0.1, 0.8, 0.1),  # Green
                    (0.1, 0.1, 0.8),  # Blue
                    (0.8, 0.8, 0.1),  # Yellow
                    (0.8, 0.1, 0.8),  # Magenta
                    (0.1, 0.8, 0.8),  # Cyan
                ]
                rep.randomizer.material(
                    albedo=rep.distribution.choice(albedo_values),
                    roughness=rep.distribution.uniform(0.1, 0.9),
                    metallic=rep.distribution.uniform(0.0, 0.2)
                )
        return prims.node

    # Background randomization
    def randomize_backgrounds():
        with rep.randomizer:
            # Randomize environment textures
            rep.randomizer.environment(
                texture=rep.distribution.choice([
                    "path/to/env1.hdr",
                    "path/to/env2.hdr",
                    "path/to/env3.hdr"
                ])
            )
        return rep.get.light(path_pattern="/World/Light")

    # Camera parameter randomization
    def randomize_camera():
        with rep.randomizer:
            camera = rep.get.camera(path_pattern="/World/Camera")
            with camera:
                rep.modify.pose(
                    position=rep.distribution.uniform((-2, 1, -2), (2, 3, 2)),
                    rotation=rep.distribution.uniform((-10, -180, -10), (10, 180, 10))
                )
        return camera.node

    return randomize_materials, randomize_backgrounds, randomize_camera
```

### Annotation Generation with Replicator

```python
def setup_annotation_pipeline():
    """Set up annotation generation pipeline"""

    # Semantic segmentation
    with rep.trigger.on_frame(num_frames=100):
        # Semantic segmentation annotations
        semantic_annotator = rep.annotators.aaBB2D()
        semantic_annotator.attach([rep.get.camera()])

        # Instance segmentation
        instance_annotator = rep.annotators.instance_segmentation()
        instance_annotator.attach([rep.get.camera()])

        # Bounding boxes
        bbox_annotator = rep.annotators.bounding_box_2d_stronger()
        bbox_annotator.attach([rep.get.camera()])

        # Depth maps
        depth_annotator = rep.annotators.distance_to_camera()
        depth_annotator.attach([rep.get.camera()])

        # 3D bounding boxes
        bbox_3d_annotator = rep.annotators.bounding_box_3d()
        bbox_3d_annotator.attach([rep.get.camera()])

def generate_annotated_dataset(num_samples=1000):
    """Generate a complete annotated dataset"""

    # Set up randomization functions
    lighting_randomizer, object_randomizer = setup_replicator_pipeline()
    material_randomizer, bg_randomizer, camera_randomizer = advanced_domain_randomization()

    # Set up annotation pipeline
    setup_annotation_pipeline()

    # Execute pipeline
    with rep.trigger.on_frame(num_frames=num_samples):
        # Apply randomizations
        rep.randomizer.register(lighting_randomizer)
        rep.randomizer.register(object_randomizer)
        rep.randomizer.register(material_randomizer)
        rep.randomizer.register(bg_randomizer)
        rep.randomizer.register(camera_randomizer)

    # Run the orchestrator
    rep.orchestrator.run()
```

## Automated Scene Variation Systems

### Procedural Scene Generation

```python
# Example: Procedural scene generation system
import random
import numpy as np

class ProceduralSceneGenerator:
    def __init__(self, scene_template_path):
        self.scene_template = self.load_template(scene_template_path)
        self.object_library = self.load_object_library()
        self.material_library = self.load_material_library()

    def load_template(self, path):
        """Load scene template with placeholders for variation"""
        # Load USD template with variation points
        return path

    def load_object_library(self):
        """Load library of objects for scene placement"""
        return {
            "vehicles": ["car1.usd", "truck1.usd", "bus1.usd"],
            "pedestrians": ["person1.usd", "person2.usd"],
            "obstacles": ["box1.usd", "cone1.usd", "barrier1.usd"],
            "environment": ["tree1.usd", "building1.usd", "sign1.usd"]
        }

    def load_material_library(self):
        """Load library of materials for randomization"""
        return {
            "asphalt": {"albedo": (0.2, 0.2, 0.2), "roughness": 0.8},
            "grass": {"albedo": (0.2, 0.6, 0.2), "roughness": 0.6},
            "concrete": {"albedo": (0.7, 0.7, 0.7), "roughness": 0.5}
        }

    def generate_scene(self, variation_params=None):
        """Generate a scene with specified variations"""

        if variation_params is None:
            variation_params = self.generate_random_params()

        # Create new stage
        stage = self.create_base_scene()

        # Add objects based on parameters
        self.add_objects_to_scene(stage, variation_params)

        # Apply environmental conditions
        self.apply_environmental_conditions(stage, variation_params)

        # Configure lighting
        self.configure_lighting(stage, variation_params)

        return stage

    def generate_random_params(self):
        """Generate random parameters for scene variation"""
        return {
            "object_count": random.randint(5, 20),
            "object_types": random.choices(
                list(self.object_library.keys()),
                weights=[0.3, 0.2, 0.2, 0.3],
                k=random.randint(3, 8)
            ),
            "weather": random.choice(["clear", "cloudy", "rainy", "foggy"]),
            "time_of_day": random.choice(["morning", "noon", "afternoon", "evening"]),
            "location": random.choice(["urban", "suburban", "rural", "indoor"]),
            "crowd_density": random.uniform(0.1, 0.9),
            "traffic_density": random.uniform(0.1, 0.8)
        }

    def add_objects_to_scene(self, stage, params):
        """Add objects to the scene based on parameters"""

        for obj_type in params["object_types"]:
            obj_files = self.object_library[obj_type]
            for _ in range(random.randint(1, 3)):
                obj_file = random.choice(obj_files)
                position = self.generate_random_position(stage, obj_type)

                # Add object to scene
                self.add_object_at_position(stage, obj_file, position)

    def generate_random_position(self, stage, obj_type):
        """Generate valid random position for object"""
        # Implement collision checking and valid position generation
        x = random.uniform(-20, 20)
        y = 0.1  # Slightly above ground
        z = random.uniform(-20, 20)
        return (x, y, z)

    def apply_environmental_conditions(self, stage, params):
        """Apply environmental conditions based on parameters"""

        if params["weather"] == "rainy":
            self.add_rain_effects(stage)
        elif params["weather"] == "foggy":
            self.add_fog_effects(stage)

        if params["time_of_day"] == "night":
            self.add_night_lighting(stage)

    def create_base_scene(self):
        """Create the base scene structure"""
        # Create a new USD stage with basic environment
        from pxr import Usd, UsdGeom
        stage = Usd.Stage.CreateNew(f"temp_scene_{random.randint(1000, 9999)}.usd")

        # Add basic elements
        world = UsdGeom.Xform.Define(stage, "/World")
        ground = UsdGeom.Mesh.Define(stage, "/World/Ground")

        return stage
```

### Batch Processing System

```python
def create_batch_processing_system():
    """Create a system for batch processing scene variations"""

    def batch_generate_scenes(base_scene, num_variations=1000):
        """Generate batch of scene variations"""

        for i in range(num_variations):
            # Generate random parameters
            params = generate_variation_params()

            # Create variation of base scene
            variation_scene = create_scene_variation(base_scene, params)

            # Render and annotate
            rendered_data = render_scene(variation_scene)
            annotations = generate_annotations(variation_scene, rendered_data)

            # Validate and store
            if validate_data_quality(rendered_data, annotations):
                store_data(rendered_data, annotations, f"scene_{i:06d}")

            # Clean up
            cleanup_scene(variation_scene)

    def generate_variation_params():
        """Generate parameters for scene variation"""
        return {
            "lighting": {
                "intensity": random.uniform(0.5, 2.0),
                "color_temp": random.uniform(3000, 8000),
                "direction": (
                    random.uniform(-1, 1),
                    random.uniform(-1, 1),
                    random.uniform(-1, 1)
                )
            },
            "objects": {
                "count": random.randint(3, 15),
                "types": random.choices(["car", "pedestrian", "obstacle"],
                                      weights=[0.5, 0.3, 0.2], k=5),
                "positions": [(random.uniform(-10, 10), 0, random.uniform(-10, 10))
                             for _ in range(random.randint(3, 15))]
            },
            "camera": {
                "position": (
                    random.uniform(-5, 5),
                    random.uniform(1, 3),
                    random.uniform(-5, 5)
                ),
                "fov": random.uniform(30, 90)
            }
        }

    return batch_generate_scenes
```

## Batch Data Generation

### Parallel Processing Framework

```python
import multiprocessing as mp
from concurrent.futures import ProcessPoolExecutor, ThreadPoolExecutor
import queue
import threading

class BatchDataGenerator:
    def __init__(self, num_processes=None, batch_size=32):
        self.num_processes = num_processes or mp.cpu_count()
        self.batch_size = batch_size
        self.task_queue = queue.Queue()
        self.result_queue = queue.Queue()

    def generate_batch(self, config, output_dir, num_samples):
        """Generate a batch of synthetic data samples"""

        # Split work into chunks
        chunks = self.split_work(num_samples, self.num_processes)

        with ProcessPoolExecutor(max_workers=self.num_processes) as executor:
            futures = []
            for chunk_idx, chunk_size in enumerate(chunks):
                start_idx = sum(chunks[:chunk_idx])
                future = executor.submit(
                    self.worker_process,
                    config,
                    output_dir,
                    start_idx,
                    chunk_size
                )
                futures.append(future)

            # Collect results
            for future in futures:
                result = future.result()
                print(f"Worker completed: {result}")

    def worker_process(self, config, output_dir, start_idx, num_samples):
        """Worker process for generating data samples"""

        results = []
        for i in range(num_samples):
            sample_idx = start_idx + i

            try:
                # Generate scene
                scene = self.generate_scene_variation(config)

                # Render scene
                rendered_data = self.render_scene(scene, config["camera"])

                # Generate annotations
                annotations = self.generate_annotations(scene, rendered_data)

                # Apply post-processing
                processed_data = self.post_process(rendered_data, annotations)

                # Save to disk
                self.save_sample(processed_data, annotations,
                               f"{output_dir}/sample_{sample_idx:06d}")

                results.append(f"Sample {sample_idx} completed")

            except Exception as e:
                print(f"Error generating sample {sample_idx}: {e}")
                results.append(f"Sample {sample_idx} failed: {e}")

        return results

    def split_work(self, total_samples, num_processes):
        """Split work evenly across processes"""
        base_size = total_samples // num_processes
        remainder = total_samples % num_processes

        chunks = [base_size] * num_processes
        for i in range(remainder):
            chunks[i] += 1

        return chunks

    def generate_scene_variation(self, config):
        """Generate a scene variation based on config"""
        # Implementation would use Isaac Sim APIs
        # to create a randomized scene
        pass

    def render_scene(self, scene, camera_config):
        """Render the scene from specified camera"""
        # Implementation would use Isaac Sim rendering
        pass

    def generate_annotations(self, scene, rendered_data):
        """Generate ground truth annotations"""
        # Implementation would use Isaac Sim annotation tools
        pass

    def post_process(self, rendered_data, annotations):
        """Apply post-processing to generated data"""
        # Implementation might include compression, format conversion, etc.
        pass

    def save_sample(self, data, annotations, filename_prefix):
        """Save a data sample to disk"""
        # Save image
        # Save annotations in appropriate format (COCO, KITTI, etc.)
        # Save metadata
        pass
```

### Memory and Storage Optimization

```python
def optimize_batch_generation():
    """Optimization techniques for batch generation"""

    # Memory management
    def memory_efficient_rendering():
        """Render in memory-efficient chunks"""
        # Use streaming textures
        # Implement object pooling
        # Use level-of-detail appropriately
        pass

    # Storage optimization
    def efficient_storage_format(data_type):
        """Choose appropriate storage format based on data type"""

        formats = {
            "rgb_image": "png_16bit",  # or jpeg with appropriate quality
            "depth_map": "png_16bit",  # or specialized depth formats
            "semantic_seg": "png_8bit",  # indexed color format
            "instance_seg": "png_32bit",  # for instance IDs
            "annotations": "json",  # COCO format or similar
            "metadata": "json"  # scene metadata
        }

        return formats.get(data_type, "png_16bit")

    # Compression strategies
    def adaptive_compression(scene_complexity):
        """Apply compression based on scene complexity"""

        if scene_complexity > 0.8:  # High detail scenes
            return {"format": "png", "quality": 100}
        elif scene_complexity > 0.5:  # Medium detail
            return {"format": "png", "quality": 95}
        else:  # Low detail scenes
            return {"format": "jpeg", "quality": 90}

    return memory_efficient_rendering, efficient_storage_format, adaptive_compression
```

## Annotation and Labeling Automation

### Multi-Modal Annotation System

```python
class AnnotationGenerator:
    def __init__(self):
        self.annotation_types = {
            "2d_bbox": self.generate_2d_bounding_boxes,
            "3d_bbox": self.generate_3d_bounding_boxes,
            "semantic_seg": self.generate_semantic_segmentation,
            "instance_seg": self.generate_instance_segmentation,
            "depth": self.generate_depth_maps,
            "optical_flow": self.generate_optical_flow,
            "pose": self.generate_poses,
            "keypoints": self.generate_keypoints
        }

    def generate_all_annotations(self, scene, rendered_data):
        """Generate all annotation types for a scene"""

        annotations = {}

        for ann_type, generator_func in self.annotation_types.items():
            try:
                annotations[ann_type] = generator_func(scene, rendered_data)
            except Exception as e:
                print(f"Error generating {ann_type} annotations: {e}")
                annotations[ann_type] = None

        return annotations

    def generate_2d_bounding_boxes(self, scene, rendered_data):
        """Generate 2D bounding box annotations"""

        # Get all prims in the scene
        prims = self.get_all_prims(scene)

        bboxes = []
        for prim in prims:
            if self.is_annotatable(prim):
                # Project 3D bounding box to 2D
                bbox_2d = self.project_3d_bbox_to_2d(
                    prim.GetWorldBound(0, 0)[0],  # Lower bound
                    prim.GetWorldBound(0, 0)[1],  # Upper bound
                    rendered_data["camera_matrix"]
                )

                bboxes.append({
                    "label": self.get_prim_label(prim),
                    "bbox": bbox_2d,
                    "confidence": 1.0  # Perfect confidence in simulation
                })

        return bboxes

    def generate_3d_bounding_boxes(self, scene, rendered_data):
        """Generate 3D bounding box annotations"""

        prims = self.get_all_prims(scene)

        bboxes_3d = []
        for prim in prims:
            if self.is_annotatable(prim):
                # Get 3D bounding box in world coordinates
                lower, upper = prim.GetWorldBound(0, 0)

                center = [(lower[i] + upper[i]) / 2 for i in range(3)]
                size = [upper[i] - lower[i] for i in range(3)]

                bboxes_3d.append({
                    "label": self.get_prim_label(prim),
                    "center": center,
                    "size": size,
                    "rotation": self.get_prim_rotation(prim),
                    "confidence": 1.0
                })

        return bboxes_3d

    def generate_semantic_segmentation(self, scene, rendered_data):
        """Generate semantic segmentation masks"""

        # In Isaac Sim, this would use the semantic segmentation renderer
        # For this example, we'll simulate the process

        # Create segmentation mask based on prim materials/labels
        segmentation_map = np.zeros(
            (rendered_data["height"], rendered_data["width"]),
            dtype=np.int32
        )

        # Render each prim with its semantic label
        prims = self.get_all_prims(scene)
        for i, prim in enumerate(prims):
            if self.is_annotatable(prim):
                label_id = self.get_semantic_label_id(prim)
                mask = self.render_prim_mask(prim, rendered_data)
                segmentation_map[mask] = label_id

        return segmentation_map

    def generate_instance_segmentation(self, scene, rendered_data):
        """Generate instance segmentation masks"""

        instance_map = np.zeros(
            (rendered_data["height"], rendered_data["width"]),
            dtype=np.int32
        )

        prims = self.get_all_prims(scene)
        for i, prim in enumerate(prims, 1):  # Start from 1 (0 is background)
            if self.is_annotatable(prim):
                mask = self.render_prim_mask(prim, rendered_data)
                instance_map[mask] = i

        return instance_map

    def generate_depth_maps(self, scene, rendered_data):
        """Generate depth maps"""

        # In Isaac Sim, this would use the depth camera renderer
        # For simulation, we'll calculate depth from camera parameters
        depth_map = self.calculate_depth_from_scene(scene, rendered_data)

        return depth_map

    def get_all_prims(self, scene):
        """Get all prims in the scene"""
        # This would use Isaac Sim's USD API
        # For example: stage.TraverseAll()
        pass

    def is_annotatable(self, prim):
        """Check if a prim should be annotated"""
        # Check if prim has appropriate schema for annotation
        # Skip purely decorative elements
        pass

    def get_prim_label(self, prim):
        """Get the semantic label for a prim"""
        # Extract label from prim metadata or naming convention
        pass
```

### Quality Validation Pipeline

```python
class QualityValidator:
    def __init__(self):
        self.checks = [
            self.check_annotation_completeness,
            self.check_annotation_consistency,
            self.check_image_quality,
            self.check_data_format,
            self.check_statistical_properties
        ]

    def validate_sample(self, data, annotations, metadata):
        """Validate a complete data sample"""

        results = {}

        for check_func in self.checks:
            try:
                result = check_func(data, annotations, metadata)
                results[check_func.__name__] = result
            except Exception as e:
                results[check_func.__name__] = {
                    "status": "error",
                    "message": str(e)
                }

        # Overall validation result
        overall_status = all(
            result.get("status") == "pass"
            for result in results.values()
            if isinstance(result, dict)
        )

        return {
            "overall_status": "pass" if overall_status else "fail",
            "details": results
        }

    def check_annotation_completeness(self, data, annotations, metadata):
        """Check if annotations are complete"""

        required_annotation_types = ["2d_bbox", "semantic_seg"]
        present_types = [k for k, v in annotations.items() if v is not None]

        missing_types = set(required_annotation_types) - set(present_types)

        if missing_types:
            return {
                "status": "fail",
                "missing": list(missing_types),
                "message": f"Missing required annotation types: {missing_types}"
            }

        return {"status": "pass"}

    def check_annotation_consistency(self, data, annotations, metadata):
        """Check consistency between different annotation types"""

        if ("2d_bbox" in annotations and
            "semantic_seg" in annotations and
            annotations["2d_bbox"] is not None and
            annotations["semantic_seg"] is not None):

            # Check if bounding boxes are consistent with segmentation
            bbox_consistent = self.validate_bbox_segmentation_consistency(
                annotations["2d_bbox"],
                annotations["semantic_seg"]
            )

            if not bbox_consistent:
                return {
                    "status": "fail",
                    "message": "Bounding box and segmentation annotations are inconsistent"
                }

        return {"status": "pass"}

    def check_image_quality(self, data, annotations, metadata):
        """Check image quality metrics"""

        image = data["rgb"] if isinstance(data, dict) else data

        # Check for common quality issues
        metrics = {
            "blur": self.calculate_blur_metric(image),
            "noise": self.calculate_noise_metric(image),
            "exposure": self.calculate_exposure_metric(image),
            "resolution": image.shape if hasattr(image, 'shape') else None
        }

        # Define thresholds
        if metrics["blur"] > 0.5:  # Example threshold
            return {
                "status": "fail",
                "metrics": metrics,
                "message": f"Image appears blurry (blur score: {metrics['blur']})"
            }

        return {"status": "pass", "metrics": metrics}

    def calculate_blur_metric(self, image):
        """Calculate blur metric using Laplacian variance"""
        import cv2
        gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY) if len(image.shape) == 3 else image
        laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        # Normalize to 0-1 scale (lower is more blurred)
        return max(0, min(1, 1.0 - laplacian_var / 1000.0))

    def calculate_noise_metric(self, image):
        """Calculate noise metric"""
        # Simple noise estimation using image gradients
        import cv2
        gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY) if len(image.shape) == 3 else image
        # Calculate variance of gradients
        grad_x = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
        grad_y = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)
        grad_magnitude = np.sqrt(grad_x**2 + grad_y**2)
        noise_estimate = np.std(grad_magnitude)
        return min(1.0, noise_estimate / 50.0)  # Normalize
```

## Pipeline Integration and Workflow

### Complete Pipeline Example

```python
def create_complete_synthetic_data_pipeline():
    """Create a complete synthetic data generation pipeline"""

    # Initialize components
    scene_generator = ProceduralSceneGenerator("templates/urban.usd")
    annotation_generator = AnnotationGenerator()
    quality_validator = QualityValidator()
    batch_generator = BatchDataGenerator()

    def generate_dataset(config):
        """Generate complete dataset with all components"""

        print(f"Starting dataset generation: {config['name']}")
        print(f"Target samples: {config['num_samples']}")

        # Generate scenes in batches
        for batch_idx in range(0, config['num_samples'], config['batch_size']):
            batch_start = batch_idx
            batch_end = min(batch_start + config['batch_size'], config['num_samples'])
            batch_size = batch_end - batch_start

            print(f"Processing batch {batch_start} to {batch_end}")

            # Generate batch of scenes
            batch_scenes = []
            for i in range(batch_size):
                scene = scene_generator.generate_scene()
                batch_scenes.append(scene)

            # Process each scene in the batch
            successful_samples = 0
            for i, scene in enumerate(batch_scenes):
                try:
                    # Render scene
                    rendered_data = render_scene_with_config(scene, config['render_config'])

                    # Generate annotations
                    annotations = annotation_generator.generate_all_annotations(
                        scene, rendered_data
                    )

                    # Validate quality
                    validation_result = quality_validator.validate_sample(
                        rendered_data, annotations, config
                    )

                    if validation_result['overall_status'] == 'pass':
                        # Save sample
                        sample_path = f"{config['output_dir']}/sample_{batch_start + i:06d}"
                        save_sample(rendered_data, annotations, sample_path)
                        successful_samples += 1
                    else:
                        print(f"Sample {batch_start + i} failed validation: {validation_result}")

                except Exception as e:
                    print(f"Error processing sample {batch_start + i}: {e}")

            print(f"Batch completed: {successful_samples}/{batch_size} samples saved")

        print("Dataset generation completed!")

    return generate_dataset

# Example usage
pipeline = create_complete_synthetic_data_pipeline()

dataset_config = {
    "name": "urban_navigation_dataset",
    "num_samples": 10000,
    "batch_size": 100,
    "output_dir": "./datasets/urban_navigation",
    "render_config": {
        "resolution": (1920, 1080),
        "camera_models": ["rgb", "depth", "semantic"],
        "sensors": ["camera", "lidar"]
    },
    "variation_params": {
        "weather_range": ["clear", "cloudy", "rainy"],
        "time_range": ["day", "dusk", "night"],
        "object_density": (5, 20),
        "lighting_variation": True
    }
}

# Generate the dataset
pipeline(dataset_config)
```

## Performance Optimization

### Parallel Processing Optimization

```python
def optimize_pipeline_performance():
    """Optimization strategies for pipeline performance"""

    # GPU utilization optimization
    def optimize_gpu_usage():
        """Optimize GPU usage for rendering"""

        # Use GPU instancing for repeated objects
        # Implement efficient texture streaming
        # Use appropriate level of detail
        # Optimize render passes
        pass

    # Memory management
    def memory_efficient_pipeline():
        """Implement memory-efficient pipeline"""

        # Use memory mapping for large datasets
        # Implement object pooling
        # Use streaming for large scenes
        # Optimize data structures
        pass

    # I/O optimization
    def optimize_disk_io():
        """Optimize disk input/output operations"""

        # Use asynchronous I/O
        # Implement compression
        # Use appropriate file formats
        # Batch I/O operations
        pass

    return optimize_gpu_usage, memory_efficient_pipeline, optimize_disk_io
```

## Exercises

1. **Exercise 1**: Implement a batch data generation pipeline that creates 1000 varied warehouse scenes with proper annotations and validates the quality of generated data.

2. **Exercise 2**: Create a domain randomization system that systematically varies lighting, materials, and object positions for a specific robotics task.

3. **Exercise 3**: Develop a quality validation pipeline that checks synthetic data for completeness, consistency, and quality metrics.

4. **Exercise 4**: Design and implement a multi-modal annotation system that generates 2D/3D bounding boxes, segmentation masks, and depth maps simultaneously.

## Best Practices

### Pipeline Design Best Practices

1. **Modular Design**: Keep pipeline components modular and reusable
2. **Configuration-Driven**: Use configuration files for pipeline parameters
3. **Error Handling**: Implement comprehensive error handling and recovery
4. **Logging and Monitoring**: Maintain detailed logs of pipeline execution
5. **Quality Assurance**: Include validation at every stage of the pipeline

### Performance Best Practices

1. **Parallel Processing**: Maximize parallel processing opportunities
2. **Resource Management**: Efficiently manage GPU, CPU, and memory resources
3. **Storage Optimization**: Use appropriate compression and storage formats
4. **Caching**: Implement intelligent caching for repeated operations
5. **Monitoring**: Monitor performance metrics and optimize accordingly

## Conclusion

Data generation pipelines in Isaac Sim provide the infrastructure needed to systematically create large-scale, high-quality synthetic datasets for robotics applications. The combination of procedural scene generation, systematic randomization through Replicator, comprehensive annotation systems, and quality validation creates a robust pipeline for synthetic data generation.

The modular architecture allows for customization to specific robotics tasks while maintaining efficiency and scalability. As we continue through this module, we'll explore advanced techniques for domain randomization and the practical tools available in Isaac Sim for creating production-ready synthetic datasets that enable effective sim-to-real transfer of robotic perception systems.