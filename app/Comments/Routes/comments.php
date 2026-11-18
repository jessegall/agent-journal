<?php

declare(strict_types=1);

use App\Http\Controllers\Comments\CommentLocationController;
use App\Http\Controllers\Comments\ListCommentsController;
use App\Http\Controllers\Comments\PostCommentController;
use Illuminate\Support\Facades\Route;

Route::middleware('journal.agent')->prefix('agent/comments')->name('comments.agent.')->group(function (): void {
    Route::post('post', PostCommentController::class)->name('post');
    Route::post('list', ListCommentsController::class)->name('list');
    Route::post('location', CommentLocationController::class)->name('location');
});

Route::middleware(['web', 'auth', 'journal.user'])->prefix('comments')->name('comments.')->group(function (): void {
    Route::post('post', PostCommentController::class)->name('post');
    Route::get('list', ListCommentsController::class)->name('list');
    Route::get('location', CommentLocationController::class)->name('location');
});
