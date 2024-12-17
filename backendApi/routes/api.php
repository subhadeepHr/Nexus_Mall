<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PatchReportController;
use Illuminate\Support\Facades\Request;

Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['status' => 'CSRF cookie set']);
});

Route::post('/login', [AuthController::class, 'login']);

Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/user', [AuthController::class, 'user'])->middleware('auth:sanctum');


Route::get('/get-months', [PatchReportController::class, 'get_months']);
Route::get('/get-years', [PatchReportController::class, 'get_years']);

Route::post('/add-patch-report', [PatchReportController::class, 'add_patch_report']);
Route::post('/get-patch-report-data', [PatchReportController::class, 'get_patch_report_data']);

Route::get('/get-user', [UserController::class,'get_user']);
Route::get('/get-roles', [UserController::class,'get_roles']);
Route::post('/add-user', [UserController::class,'add_user']);
Route::get('/get-user-view/{id}', [UserController::class,'get_user_view']);
Route::put('/update-user/{id}', [UserController::class, 'update']);
Route::delete('/delete-user/{id}', [UserController::class, 'deleteUser']);



