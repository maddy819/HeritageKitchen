<script setup>
import AdminLayout from "@/Layouts/AdminLayout.vue";
import { Link, router } from "@inertiajs/vue3";
import { route } from "ziggy-js";
import { ref, watch, onMounted, onBeforeUnmount } from "vue";

const openId = ref(null);

const toggleDropdown = (id) => {
    openId.value = openId.value === id ? null : id;
};

const handleClickOutside = (event) => {
    if (!event.target.closest(".dropdown")) {
        openId.value = null;
    }
};

onMounted(() => {
    document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside);
});

const props = defineProps({
    categories: {
        type: Object,
        required: true,
    },
    filters: {
        type: Object,
        default: () => ({ search: "", status: "" }),
    },
});

const search = ref(props.filters.search || "");
const status = ref(props.filters.status || "");
const selectedCategories = ref([]);
const selectAll = ref(false);

// Watch for search input with debounce
let searchTimeout;
watch(search, (value) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        router.get(
            route("admin.categories"),
            { search: value, status: status.value },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    }, 300);
});

// Watch for status change
watch(status, (value) => {
    router.get(
        route("admin.categories"),
        { search: search.value, status: value },
        { preserveState: true, preserveScroll: true, replace: true },
    );
});

// Watch for categories changes to update selected categories
watch(
    () => props.categories.data,
    () => {
        selectedCategories.value = [];
        selectAll.value = false;
    },
);

// Handle select all - FIXED
watch(selectAll, (value) => {
    if (value) {
        selectedCategories.value = props.categories.data.map(
            (category) => category.id,
        );
    } else {
        selectedCategories.value = [];
    }
});

// Handle individual select - FIXED
const toggleSelect = (categoryId, event) => {
    // Use the checked property from the event
    if (event.target.checked) {
        selectedCategories.value.push(categoryId);
    } else {
        const index = selectedCategories.value.indexOf(categoryId);
        if (index > -1) {
            selectedCategories.value.splice(index, 1);
        }
    }

    // Update selectAll state
    selectAll.value =
        selectedCategories.value.length === props.categories.data.length;
};

// Load page
const loadPage = (url) => {
    router.get(url, {}, { preserveState: true, preserveScroll: true });
};

// Delete category
const deleteCategory = (id) => {
    if (confirm("Are you sure you want to delete this category?")) {
        router.delete(route("admin.categories.destroy", id), {
            preserveScroll: true,
            onSuccess: () => {
                // Optionally show success message
            },
        });
    }
};

// Delete multiple categories
const deleteSelected = () => {
    if (selectedCategories.value.length === 0) return;
    if (
        confirm(
            `Delete ${selectedCategories.value.length} selected categories?`,
        )
    ) {
        router.post(
            route("admin.categories.bulk-delete"),
            {
                ids: selectedCategories.value,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    selectedCategories.value = [];
                    selectAll.value = false;
                },
            },
        );
    }
};

// Edit category
const editCategory = (id) => {
    router.get(route("admin.categories.edit", id));
};

// Computed property to check if category is selected
const isSelected = (categoryId) => {
    return selectedCategories.value.includes(categoryId);
};
</script>

<template>
    <AdminLayout title="Categories">
        <div class="container">
            <!-- row -->
            <div class="row mb-8">
                <div class="col-md-12">
                    <div
                        class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4"
                    >
                        <!-- pageheader -->
                        <div>
                            <h2>Categories</h2>
                            <!-- breacrumb -->
                            <nav aria-label="breadcrumb">
                                <ol class="breadcrumb mb-0">
                                    <li class="breadcrumb-item">
                                        <a href="#" class="text-inherit"
                                            >Dashboard</a
                                        >
                                    </li>
                                    <li
                                        class="breadcrumb-item active"
                                        aria-current="page"
                                    >
                                        Categories
                                    </li>
                                </ol>
                            </nav>
                        </div>
                        <!-- button -->
                        <div>
                            <Link
                                :href="route('admin.categories.add')"
                                class="btn btn-primary"
                                >Add New Category</Link
                            >
                            <button
                                v-if="selectedCategories.length > 0"
                                @click="deleteSelected"
                                class="btn btn-danger ms-2"
                            >
                                Delete Selected ({{
                                    selectedCategories.length
                                }})
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-xl-12 col-12 mb-5">
                    <!-- card -->
                    <div class="card h-100 card-lg">
                        <div class="px-6 py-6">
                            <div class="row justify-content-between">
                                <div
                                    class="col-lg-4 col-md-6 col-12 mb-2 mb-md-0"
                                >
                                    <!-- form -->
                                    <form
                                        class="d-flex"
                                        role="search"
                                        @submit.prevent
                                    >
                                        <input
                                            class="form-control"
                                            type="search"
                                            placeholder="Search Category"
                                            aria-label="Search"
                                            v-model="search"
                                        />
                                    </form>
                                </div>
                                <!-- select option -->
                                <div class="col-xl-2 col-md-4 col-12">
                                    <select
                                        class="form-select"
                                        v-model="status"
                                    >
                                        <option value="">All Status</option>
                                        <option value="1">Active</option>
                                        <option value="0">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <!-- card body -->
                        <div class="card-body p-0">
                            <!-- table -->
                            <div class="table-responsive">
                                <table
                                    class="table table-centered table-hover mb-0 text-nowrap table-borderless table-with-checkbox"
                                >
                                    <thead class="bg-light">
                                        <tr>
                                            <th>
                                                <div class="form-check">
                                                    <input
                                                        class="form-check-input"
                                                        type="checkbox"
                                                        id="checkAll"
                                                        v-model="selectAll"
                                                    />
                                                    <label
                                                        class="form-check-label"
                                                        for="checkAll"
                                                    ></label>
                                                </div>
                                            </th>
                                            <th>Icon</th>
                                            <th>Name</th>
                                            <th>Parent</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr
                                            v-for="category in categories.data"
                                            :key="category.id"
                                        >
                                            <td>
                                                <div class="form-check">
                                                    <!-- METHOD 1: Using v-model with computed property -->
                                                    <input
                                                        class="form-check-input"
                                                        type="checkbox"
                                                        :value="category.id"
                                                        :id="
                                                            'category' +
                                                            category.id
                                                        "
                                                        :checked="
                                                            isSelected(
                                                                category.id,
                                                            )
                                                        "
                                                        @change="
                                                            (e) =>
                                                                toggleSelect(
                                                                    category.id,
                                                                    e,
                                                                )
                                                        "
                                                    />
                                                    <label
                                                        class="form-check-label"
                                                        :for="
                                                            'category' +
                                                            category.id
                                                        "
                                                    ></label>
                                                </div>
                                            </td>
                                            <td>
                                                <a href="#!">
                                                    <img
                                                        :src="
                                                            category.image_url ||
                                                            '/assets/images/icons/snacks.svg'
                                                        "
                                                        alt=""
                                                        class="icon-shape icon-sm"
                                                    />
                                                </a>
                                            </td>
                                            <td>
                                                <a
                                                    href="#"
                                                    class="text-reset"
                                                    >{{ category.name }}</a
                                                >
                                                <span
                                                    v-if="
                                                        category.children &&
                                                        category.children
                                                            .length > 0
                                                    "
                                                    class="badge bg-light-secondary ms-2"
                                                >
                                                    {{
                                                        category.children.length
                                                    }}
                                                    sub
                                                </span>
                                            </td>
                                            <td>
                                                <span
                                                    v-if="
                                                        category.parent_id ===
                                                        null
                                                    "
                                                    class="badge bg-light-primary text-dark-primary"
                                                >
                                                    Parent
                                                </span>
                                                <span
                                                    v-else
                                                    class="badge bg-light-info text-dark-info"
                                                >
                                                    Child
                                                </span>
                                            </td>
                                            <td>
                                                <span
                                                    v-if="
                                                        category.is_active == 1
                                                    "
                                                    class="badge bg-light-primary text-dark-primary"
                                                >
                                                    Active
                                                </span>
                                                <span
                                                    class="badge bg-light-danger text-dark-danger"
                                                    v-else
                                                >
                                                    Inactive
                                                </span>
                                            </td>

                                            <td>
                                                <div class="dropdown">
                                                    <button
                                                        class="text-reset nav-link"
                                                        @click.prevent="
                                                            toggleDropdown(
                                                                category.id,
                                                            )
                                                        "
                                                    >
                                                        <i
                                                            class="feather-icon icon-more-vertical fs-5"
                                                        ></i>
                                                    </button>
                                                    <ul
                                                        v-if="
                                                            openId ===
                                                            category.id
                                                        "
                                                        class="dropdown-menu show"
                                                    >
                                                        <li>
                                                            <a
                                                                class="dropdown-item"
                                                                href="#"
                                                                @click.prevent="
                                                                    deleteCategory(
                                                                        category.id,
                                                                    )
                                                                "
                                                            >
                                                                <i
                                                                    class="bi bi-trash me-3"
                                                                ></i>
                                                                Delete
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <Link
                                                              class="dropdown-item"
                                                              :href="route('admin.categories.edit', category.id)"
                                                            >
                                                                <i
                                                                    class="bi bi-pencil-square me-3"
                                                                ></i>
                                                                Edit
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr v-if="categories.data.length === 0">
                                            <td
                                                colspan="6"
                                                class="text-center py-5"
                                            >
                                                No categories found
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- Pagination -->
                        <div
                            class="border-top d-flex justify-content-between align-items-md-center px-6 py-6 flex-md-row flex-column gap-4"
                        >
                            <span>
                                Showing {{ categories.from || 0 }} to
                                {{ categories.to || 0 }} of
                                {{ categories.total || 0 }} entries
                            </span>
                            <nav>
                                <ul class="pagination mb-0">
                                    <li
                                        class="page-item"
                                        :class="{
                                            disabled: !categories.prev_page_url,
                                        }"
                                    >
                                        <a
                                            class="page-link"
                                            href="#"
                                            @click.prevent="
                                                categories.prev_page_url &&
                                                loadPage(
                                                    categories.first_page_url,
                                                )
                                            "
                                        >
                                            First
                                        </a>
                                    </li>

                                    <!-- Page numbers -->
                                    <li
                                        v-for="link in categories.links"
                                        :key="link.label"
                                        class="page-item"
                                        :class="{
                                            active: link.active,
                                            disabled: !link.url,
                                        }"
                                    >
                                        <a
                                            class="page-link"
                                            href="#"
                                            v-html="link.label"
                                            @click.prevent="
                                                link.url && loadPage(link.url)
                                            "
                                        ></a>
                                    </li>

                                    <li
                                        class="page-item"
                                        :class="{
                                            disabled: !categories.next_page_url,
                                        }"
                                    >
                                        <a
                                            class="page-link"
                                            href="#"
                                            @click.prevent="
                                                categories.next_page_url &&
                                                loadPage(
                                                    categories.last_page_url,
                                                )
                                            "
                                        >
                                            Last
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>
