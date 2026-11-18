<?php

declare(strict_types=1);

use App\Http\Controllers\Actors\RecordUserHeartbeatController;
use Illuminate\Support\Facades\Route;

Route::post('/presence/heartbeat', RecordUserHeartbeatController::class)->middleware(['web', 'auth', 'journal.user'])->name('actors.presence.heartbeat');
