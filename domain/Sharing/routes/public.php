<?php

declare(strict_types=1);

use Domain\Sharing\Http\Controllers\ProbeChallengeController;
use Domain\Sharing\Http\Controllers\ReadShareController;
use Domain\Sharing\Http\Controllers\SharingAssetController;
use Illuminate\Support\Facades\Route;

Route::match(['GET', 'HEAD'], '/s/{token}/{path?}', ReadShareController::class)
    ->where('token', '[A-Za-z0-9_-]{43}')
    ->where('path', '.*');

Route::match(['GET', 'HEAD'], '/build-sharing/{file}', SharingAssetController::class)
    ->where('file', '[A-Za-z0-9._/-]+');

Route::get('/_probe/{challenge}', ProbeChallengeController::class)
    ->where('challenge', '[a-f0-9]{32}');
