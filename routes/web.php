<?php

use App\Http\Controllers\admin\AddCategoryController;
use App\Http\Controllers\admin\AddProductController;
use App\Http\Controllers\admin\CategoriesController;
use App\Http\Controllers\admin\ProductsController;
use App\Http\Controllers\app\AboutController;
use App\Http\Controllers\app\ContactController;
use App\Http\Controllers\app\HomeController;
use App\Http\Controllers\admin\DashboardController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\app\CustomerDashboardController;
use App\Http\Controllers\Auth\VerifyEmailController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/about', [AboutController::class, 'index'])->name('about');
Route::get('/contact', [ContactController::class, 'index'])->name('contact');

//Route::get('/admin/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');

// Guest routes
Route::middleware('guest')->group(function () {
    // Registration
    Route::get('signup', [RegisteredUserController::class, 'create'])->name('signup');
    Route::post('signup', [RegisteredUserController::class, 'store'])->name('signup.store');

    // Login
    Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store'])->name('login.do');

    // Password Reset
    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])->name('password.request');
    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])->name('password.email');
    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])->name('password.reset');
    Route::post('reset-password', [NewPasswordController::class, 'store'])->name('password.store');
});

// Authenticated routes
Route::middleware('')->group(function () {
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    // Email verification routes
    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('verification.notice');

    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');
});

// Customer routes
Route::middleware(['auth', 'verified', 'customer'])->prefix('customer')->name('customer.')->group(function () {
    Route::get('dashboard', [CustomerDashboardController::class, 'index'])->name('dashboard');
});

// Admin routes
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('products', [ProductsController::class, 'index'])->name('products');
    Route::get('products/add', [AddProductController::class, 'index'])->name('products.add');
    Route::post('products/store', [AddProductController::class, 'store'])->name('products.store');

    Route::get('categories', [CategoriesController::class, 'index'])->name('categories');
    Route::get('categories/add', [AddCategoryController::class, 'index'])->name('categories.add');
    Route::post('categories/store', [AddCategoryController::class, 'store'])->name('categories.store');
});

