<?php

declare(strict_types=1);

use App\Http\Controllers\Processes\ExplainCommandController;
use Illuminate\Support\Facades\Route;

Route::post('/agent/processes/explain', ExplainCommandController::class)->middleware('journal.agent')->name('processes.explain');
