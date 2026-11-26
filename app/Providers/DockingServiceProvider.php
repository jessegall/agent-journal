<?php

declare(strict_types=1);

namespace App\Providers;

use App\Docking\DestinationGate;
use App\Docking\DockRegistration;
use App\Docking\NoDockOffers;
use App\Docking\NoFallbackDocks;
use App\Docking\NothingDocked;
use App\Docking\Sources\Contracts\DestinationGate as DestinationGateContract;
use App\Docking\Sources\Contracts\DockedSources;
use App\Docking\Sources\Contracts\DockOffers;
use App\Docking\Sources\Contracts\DockRegistration as DockRegistrationContract;
use App\Docking\Sources\Contracts\FallbackDocks;
use App\Support\Wire\CardEncoder;
use App\Support\Wire\Contracts\CardEncoder as CardEncoderContract;
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
        $this->app->bind(DockRegistrationContract::class, DockRegistration::class);
        $this->app->bind(DestinationGateContract::class, DestinationGate::class);
        $this->app->bind(CardEncoderContract::class, CardEncoder::class);
        $this->app->bindIf(DockOffers::class, NoDockOffers::class);
        $this->app->bindIf(DockedSources::class, NothingDocked::class);
        $this->app->bindIf(FallbackDocks::class, NoFallbackDocks::class);
        $this->app->singleton(PartMap::class, PartMap::standard(...));
    }
}
