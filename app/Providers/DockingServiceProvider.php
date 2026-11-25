<?php

declare(strict_types=1);

namespace App\Providers;

use App\Support\DestinationGate;
use App\Support\DockRegistration;
use App\Support\NoDockOffers;
use App\Support\NoFallbackDocks;
use App\Support\NothingDocked;
use App\Support\Sources\Contracts\DestinationGate as DestinationGateContract;
use App\Support\Sources\Contracts\DockedSources;
use App\Support\Sources\Contracts\DockOffers;
use App\Support\Sources\Contracts\DockRegistration as DockRegistrationContract;
use App\Support\Sources\Contracts\FallbackDocks;
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
