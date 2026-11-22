<?php

declare(strict_types=1);

namespace App\Providers;

use App\Contracts\Files\Files;
use App\Support\CodeFiles;
use App\Support\LocalFiles;
use Illuminate\Support\ServiceProvider;

/**
 * Core's file funnel: one LocalFiles for the life of the application, shared by the boot and every request, so they
 * share one content cache and one read flag.
 */
final class FilesServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(CodeFiles::class, fn () => CodeFiles::ofProcess());
        $this->app->singleton(Files::class, LocalFiles::class);
    }
}
