<?php

declare(strict_types=1);

use App\Http\Controllers\Sharing\ReadShareController;
use Illuminate\Support\Facades\Route;

Route::match(['GET', 'HEAD'], '/s/{token}/{path?}', ReadShareController::class)
    ->where('token', '[A-Za-z0-9_-]{43}')
    ->where('path', '.*');
