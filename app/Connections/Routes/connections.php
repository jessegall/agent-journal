<?php

declare(strict_types=1);

use App\Connections\Http\Controllers\InstallScriptController;
use Illuminate\Support\Facades\Route;

Route::get('/install/{ticket}', InstallScriptController::class)->name('connections.install');
