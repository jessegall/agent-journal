<?php

declare(strict_types=1);

namespace App\Docking\Providers;

use App\Docking\Sources\Contracts\DestinationGate;
use App\Docking\Sources\Contracts\DockOffers;
use App\Docking\Sources\Contracts\DockRegistration;
use App\Docking\Support\DeclaredPageGate;
use App\Docking\Support\DockDefinitions;
use App\Docking\Support\NoDockOffers;
use App\Docking\Wire\Contracts\CardEncoder;
use App\Docking\Wire\DockCardEncoder;
use App\Docking\Wire\PartMap;
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
        $this->app->singleton(PartMap::class, PartMap::standard(...));
    }
}
