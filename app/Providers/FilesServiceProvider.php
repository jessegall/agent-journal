<?php

declare(strict_types=1);

namespace App\Providers;

use App\Files\Contracts\Files as FilesContract;
use App\Files\Files;
use App\Support\CodeFiles;
use Illuminate\Support\ServiceProvider;

/**
 * Core's file funnel: one Files for the life of the application, shared by the boot and every request, so they
 * share one content cache and one read flag.
 */
final class FilesServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(CodeFiles::class, fn () => CodeFiles::ofProcess());
        $this->app->singleton(FilesContract::class, Files::class);
    }
}
