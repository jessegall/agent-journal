<?php

declare(strict_types=1);

namespace App\Sharing\Providers;

use App\Sharing\Support\ShareGatewayRegistry;
use App\Sharing\Support\ShareRecordRegistry;
use Illuminate\Support\ServiceProvider;

/**
 * Keeps one registry of shareable record types and one of share gateways for the application's life, filled by the
 * domains at boot; the record types' relations are checked once everything booted, so a wrong one stops the boot.
 */
final class SharingServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(ShareRecordRegistry::class);
        $this->app->singleton(ShareGatewayRegistry::class);
    }

    public function boot(): void
    {
        $this->app->booted(fn () => $this->app->make(ShareRecordRegistry::class)->checkRelations());
    }
}
