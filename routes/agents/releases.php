<?php

declare(strict_types=1);

use App\Http\Controllers\Agents\Releases\CurrentManifestController;
use App\Http\Controllers\Agents\Releases\CurrentSignatureController;
use App\Http\Controllers\Agents\Releases\ReleaseArtifactController;
use App\Http\Controllers\Agents\Releases\ReleaseCompatibilityController;
use Illuminate\Support\Facades\Route;

Route::prefix('releases')->name('agents.releases.')->group(function (): void {
    Route::get('/compatibility', ReleaseCompatibilityController::class)->name('compatibility');
    Route::get('/current/manifest.json', CurrentManifestController::class)->name('manifest');
    Route::get('/current/manifest.json.sig', CurrentSignatureController::class)->name('signature');

    Route::get('/{version}/{target}/{name}', ReleaseArtifactController::class)
        ->where([
            'version' => '[0-9A-Za-z][0-9A-Za-z.+_-]*',
            'target' => '[a-z0-9]+-[a-z0-9]+',
            'name' => '[0-9A-Za-z._-]+(/[0-9A-Za-z._-]+)*',
        ])
        ->name('artifact');
});
