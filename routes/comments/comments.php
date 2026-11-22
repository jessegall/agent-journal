<?php

declare(strict_types=1);

use App\Http\Controllers\Calls\LocateCommentController;
use App\Http\Controllers\Comments\CommentLocationController;
use App\Http\Controllers\Comments\ListCommentsController;
use App\Http\Controllers\Comments\PostCommentController;
use App\Support\CallRoutes;
use Illuminate\Container\Container;
use Illuminate\Support\Facades\Route;

Route::middleware('journal.agent')->prefix('agent')->name('comments.agent.')->group(function (): void {
    $calls = Container::getInstance()->make(CallRoutes::class);
    $calls->register(App\Http\Controllers\Calls\PostCommentController::class)->name('post');
    $calls->register(App\Http\Controllers\Calls\ListCommentsController::class)->name('list');
    $calls->register(LocateCommentController::class)->name('location');
});

Route::middleware(['web', 'auth', 'journal.user'])->prefix('comments')->name('comments.')->group(function (): void {
    Route::post('post', PostCommentController::class)->name('post');
    Route::get('list', ListCommentsController::class)->name('list');
    Route::get('location', CommentLocationController::class)->name('location');
});
