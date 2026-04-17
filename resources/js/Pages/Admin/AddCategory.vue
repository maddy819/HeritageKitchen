<script setup>
import Editor from '@/Components/UI/Editor.vue';
import FileUpload from '@/Components/UI/FileUpload.vue';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import { getDropzoneInstance, setDropzoneFiles, setOnRemoveExistingCallback } from '@/Plugins/dropzone'
import { route } from 'ziggy-js';
import InputLabel from '@/Components/UI/InputLabel.vue';
import TextInput from '@/Components/UI/TextInput.vue';
import Button from '@/Components/UI/Button.vue';
import TextArea from '@/Components/UI/TextArea.vue';
import { onMounted, nextTick, ref, computed } from "vue"
import { initDatepickers } from "@/Plugins/flatpickr"
import { Link, useForm } from '@inertiajs/vue3';
import axios from 'axios';

const validationErrors = ref({});
const isLoading = ref(false)
const deletedImages = ref([]);
const editorRef = ref(null);

const props = defineProps({
  categories: {
    type: Array,
    required: true,
  },
  category: {
    type: Object,
    required: false,
  },
})

// Function to handle removal of existing images
const handleExistingImageRemoval = (imageId, file) => {
    console.log('Image marked for deletion:', imageId);
    deletedImages.value.push(imageId);
}

onMounted(async () => {
    await nextTick()
    initDatepickers()
    
    // Set callback for existing image removal
    setOnRemoveExistingCallback(handleExistingImageRemoval);

    // If in edit mode, populate form with category data
    if (props.category && props.category.id) {
        populateFormWithCategoryData()
    }
})

// Frontend validation function
const validateForm = () => {
    const errors = {};
    
    if (!form.name.trim()) {
        errors.name = 'Name is required';
    } else if (form.name.length < 5) {
        errors.name = 'Name must be at least 5 characters';
    }
    
    validationErrors.value = errors;
    return Object.keys(errors).length === 0;
};

const form = useForm({
    id: '',
    name: '',
    parent: '',
    description: '',
    status: '1',
    meta_title: '',
    meta_description: '',
});

// Populate form with category data for editing
const populateFormWithCategoryData = async () => {
    if (props.category) {
        form.id = props.category.id || ''
        form.name = props.category.name || ''
        form.parent = props.category.parent_id || ''
        form.description = props.category.description || ''

        // FIX: Ensure status is properly set as number
        if (props.category.is_active !== undefined && props.category.is_active !== null) {
            const statusValue = props.category.is_active === true || props.category.is_active === 1 ? '1' : '0';
            form.status = statusValue;
        }

        form.meta_title = props.category.meta_title || ''
        form.meta_description = props.category.meta_description || ''
        
        // Set editor content using the ref
        if (props.category.description && editorRef.value) {
            await nextTick();
            editorRef.value.setContent(props.category.description);
        }

        // Reset deleted images array
        deletedImages.value = [];
        
        // Set existing images in dropzone if any
        if (props.category.images && props.category.images.length > 0) {
            nextTick(() => {
                setDropzoneFiles([], props.category.images);
            });
        }
    }
}

// Handle editor content update
const handleEditorUpdate = (content) => {
    form.description = content;
};

async function submit() {
    if (isLoading.value) return;

    // Clear previous errors
    validationErrors.value = {};
    form.clearErrors(); // Clear Inertia form errors
    
    // Frontend validation
    if (!validateForm()) {
        return;
    }

    isLoading.value = true
    await nextTick();

    let description = '';
    if (editorRef.value) {
        description = editorRef.value.getContent();
    }

    const dz = getDropzoneInstance();
    const formData = new FormData();

    // If editing, append id
    if (form.id) {
        formData.append("id", form.id);
    }
    
    // Append deleted images IDs
    if (deletedImages.value.length > 0) {
        formData.append("deleted_images", JSON.stringify(deletedImages.value));
        console.log('Deleting images:', deletedImages.value);
    }

    // append normal fields
    formData.append("name", form.name);
    formData.append("parent", form.parent);
    formData.append("description", description);
    formData.append("status", form.status);
    formData.append("meta_title", form.meta_title);
    formData.append("meta_description", form.meta_description);

    // Append new images only (not existing ones)
    if (dz && dz.files) {
        let newFileIndex = 0;
        for (const file of dz.files) {
            // Only send files that are not existing (new uploads)
            if (!file.existing && file instanceof File) {
                formData.append(`images[${newFileIndex}]`, file);
                newFileIndex++;
            }
        }
    }

    try {
      const response = await axios.post(route('admin.categories.store'), formData, {
          headers: {
              "Content-Type": "multipart/form-data"
          }
      });

      // Success handling
        if (response.status === 200 || response.status === 201) {
            alert(response.data.message || 'Category saved successfully!');
            
            if (!form.id) {
                // Reset for new entry
                form.reset(); // Use Inertia's form reset
                if (dz) dz.removeAllFiles(true);

                if (editorRef.value) {
                    editorRef.value.setContent(''); // Clear editor content
                }
            } else {
                // For edit mode, redirect after 1 second
                setTimeout(() => {
                    window.location.href = route('admin.categories');
                }, 1000);
                return; // Don't reset loading immediately
            }
        }
    } catch (error) {
      if (error.response && error.response.status === 422) {
          validationErrors.value = error.response.data.errors
      } else {
          alert(error.response?.data?.message || 'Something went wrong')
      }
    } finally {
      isLoading.value = false
    }
}

// Create hierarchical list with -- indentation
const hierarchicalCategories = computed(() => {
  const categories = props.categories || []
  const result = []
  
  // Only start with parent categories (parent_id is null)
  const parentCategories = categories.filter(cat => cat.parent_id === null)
  
  const buildHierarchy = (items, level = 0) => {
    for (const category of items) {
      result.push({
        id: category.id,
        name: category.name,
        display_name: `${'--'.repeat(level)}${category.name}`
      })
      
      // Add children if they exist
      if (category.children && category.children.length > 0) {
        buildHierarchy(category.children, level + 1)
      }
    }
  }
  
  buildHierarchy(parentCategories)
  return result
})
</script>

<template>
    <AdminLayout title="Add Category">
        <div class="container">
          <!-- row -->
          <div class="row mb-8">
            <div class="col-md-12">
              <div class="d-md-flex justify-content-between align-items-center">
                <!-- page header -->
                <div>
                  <h2>Add New Category</h2>
                  <!-- breacrumb -->
                  <nav aria-label="breadcrumb">
                    <ol class="breadcrumb mb-0">
                      <li class="breadcrumb-item"><Link :href="route('admin.dashboard')" class="text-inherit">Dashboard</Link></li>
                      <li class="breadcrumb-item"><Link :href="route('admin.categories')" class="text-inherit">Categories</Link></li>
                      <li class="breadcrumb-item active" aria-current="page">Add New Category</li>
                    </ol>
                  </nav>
                </div>
                <div>
                  <Link :href="route('admin.categories')" class="btn btn-light">Back to Categories</Link>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-12 col-12">
              <!-- Display summary of all errors at the top -->
                <div v-if="Object.keys(validationErrors).length > 0 || Object.keys(form.errors).length > 0" class="alert alert-danger mb-4">
                    <strong>Please fix the following errors:</strong>
                    <ul class="mb-0 mt-2">
                        <li v-for="error in validationErrors" :key="error">{{ error }}</li>
                        <li v-for="error in form.errors" :key="error">{{ error }}</li>
                    </ul>
                </div>
              <!-- card -->
              <div class="card mb-6 shadow border-0">
                <!-- card body -->
                <form @submit.prevent="submit" class="needs-validation" novalidate>
                  <div class="card-body p-6">
                    <h4 class="mb-5 h5">Category Image</h4>
                    <div class="mb-3 col-lg-12">
                      <FileUpload id="category-dropzone" url="https://httpbin.org/post" />
                    </div>
                    <h4 class="mb-4 h5 mt-5">Category Information</h4>

                    <div class="row">
                      <!-- input -->
                      <div class="mb-3 col-lg-6">
                        <TextInput type="hidden" name="id" v-model="form.id" />
                        <InputLabel for="name" class="form-label">Category Name</InputLabel>
                        <TextInput v-model="form.name" id="name" type="text" name="name" class="form-control" placeholder="Category Name" required="required" />
                        <div v-if="validationErrors.name || form.errors.name" class="invalid-feedback">{{ validationErrors.name || form.errors.name }}</div>
                      </div>
                      <!-- input -->
                      <div class="mb-3 col-lg-6">
                        <InputLabel for="parent" class="form-label">Parent Category</InputLabel>
                        <select class="form-select" v-model="form.parent" id="parent" name="parent">
                          <option value="" selected>Select Parent</option>
                          <option 
                            v-for="category in hierarchicalCategories" 
                            :key="category.id" 
                            :value="category.id"
                          >
                            {{ category.display_name }}
                          </option>
                        </select>
                      </div>
                      <!-- <div class="mb-3 col-lg-6">
                        <label class="form-label">Date</label>
                        <input type="text" class="form-control datepicker" placeholder="Select Date" />
                      </div> -->

                      <!-- input -->
                      <div class="mb-3 col-lg-12">
                        <InputLabel for="editor" class="form-label">Descriptions</InputLabel>
                        <Editor id="editor" ref="editorRef" :content="form.description" placeholder="Write category description..." @update:content="handleEditorUpdate" />
                      </div>

                      <!-- input -->
                      <div class="mb-3 col-lg-12">
                        <label class="form-label" id="productSKU">Status</label>
                        <br />
                        <div class="form-check form-check-inline">
                          <TextInput class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" :value="1" :checked="form.status == 1" @change="form.status = 1" />
                          <InputLabel class="form-check-label" for="inlineRadio1">Active</InputLabel>
                        </div>
                        <!-- input -->
                        <div class="form-check form-check-inline">
                          <TextInput class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" :value="0" :checked="form.status == 0" @change="form.status = 0" />
                          <InputLabel class="form-check-label" for="inlineRadio2">Disabled</InputLabel>
                        </div>
                        <!-- input -->
                      </div>
                      <div class="mb-3 col-lg-12 mt-5">
                        <h4 class="mb-4 h5">Meta Data</h4>
                        <!-- input -->
                        <div class="mb-3">
                          <InputLabel for="metatitle" class="form-label">Meta Title</InputLabel>
                          <TextInput v-model="form.meta_title" name="metatitle" type="text" id="metatitle" class="form-control" placeholder="Title" />
                        </div>

                        <!-- input -->
                        <div class="mb-3">
                          <InputLabel for="metadescription" class="form-label">Meta Description</InputLabel>
                          <TextArea v-model="form.meta_description" name="metaescription" class="form-control" id="metadescription" rows="3" placeholder="Meta Description" />
                        </div>
                      </div>
                      <div class="col-lg-12">
                        <Button v-if="!form.id" class="btn btn-primary" :disabled="isLoading"><span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>{{ isLoading ? 'Creating...' : 'Create' }}</Button>
                        <Button v-if="form.id" class="btn btn-secondary" :disabled="isLoading"><span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>{{ isLoading ? 'Saving...' : 'Save' }}</Button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
    </AdminLayout>
</template>