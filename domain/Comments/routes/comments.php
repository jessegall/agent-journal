<?php

declare(strict_types=1);

use App\Support\ApiRegistrar;
use Domain\Comments\Http\Controllers\Api;
use Domain\Comments\Http\Controllers\Api\LocateCommentController;
use Domain\Comments\Http\Controllers\CommentLocationController;
use Domain\Comments\Http\Controllers\ListCommentsController;
use Domain\Comments\Http\Controllers\PostCommentController;
use Domain\Comments\Http\Controllers\TellFileCommentController;
use Illuminate\Container\Container;
use Illuminate\Support\Facades\Route;

Route::middleware('journal.agent')->prefix('agent')->name('comments.agent.')->group(function (): void {
    $calls = Container::getInstance()->make(ApiRegistrar::class);
    $calls->register(Api\PostCommentController::class)->name('post');
    $calls->register(Api\ListCommentsController::class)->name('list');
    $calls->register(LocateCommentController::class)->name('location');
});

Route::middleware(['web', 'auth', 'journal.user'])->prefix('comments')->name('comments.')->group(function (): void {
    Route::post('post', PostCommentController::class)->name('post');
    Route::get('list', ListCommentsController::class)->name('list');
    Route::get('location', CommentLocationController::class)->name('location');
    Route::post('file-tell', TellFileCommentController::class)->middleware('throttle:20,1')->name('file-tell');
});
