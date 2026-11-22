<?php

declare(strict_types=1);

namespace App\Providers;

use App\Support\DeclaredPageGate;
use App\Support\DockDefinitions;
use App\Support\NoDockOffers;
use App\Support\NoFallbackDocks;
use App\Support\NothingDocked;
use App\Support\Sources\Contracts\DestinationGate;
use App\Support\Sources\Contracts\DockedSources;
use App\Support\Sources\Contracts\DockOffers;
use App\Support\Sources\Contracts\DockRegistration;
use App\Support\Sources\Contracts\FallbackDocks;
use App\Support\Wire\Contracts\CardEncoder;
use App\Support\Wire\DockCardEncoder;
use App\Support\Wire\PartMap;
use Illuminate\Support\ServiceProvider;

/**
 * Serves the registry where owners register what a conversation may dock, and the one map of card parts to their
 * wire types.
 */
final class DockingServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(DockRegistration::class, DockDefinitions::class);
        $this->app->bind(DestinationGate::class, DeclaredPageGate::class);
        $this->app->bind(CardEncoder::class, DockCardEncoder::class);
        $this->app->bindIf(DockOffers::class, NoDockOffers::class);
        $this->app->bindIf(DockedSources::class, NothingDocked::class);
        $this->app->bindIf(FallbackDocks::class, NoFallbackDocks::class);
        $this->app->singleton(PartMap::class, PartMap::standard(...));
    }
}
