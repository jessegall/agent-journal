<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Drivers\DriverCatalogue;
use App\Contracts\Drivers\DriverCompatibilities;
use App\Contracts\Events\Listener;
use App\Events\Sessions\AccountSettingsRequested;
use Illuminate\Contracts\Config\Repository;
use Illuminate\Contracts\Container\Container;

/**
 * Fills in a claimed start's account settings for a driver the journal runs, from its pinned compatibility; a build
 * or arrangement the real driver has not shown refuses the claim, so no process starts.
 */
final class SupplyAccountSettings implements Listener
{
    public function __construct(
        private DriverCompatibilities $compatibilities,
        private Repository $config,
        private Container $container,
        private DriverCatalogue $drivers,
    ) {}

    public function handle(AccountSettingsRequested $event): void
    {
        $driver = $event->driver;

        if (! $this->drivers->hasFamily($driver)) {
            return;
        }

        $compatibility = $this->compatibilities->for($driver);
        $compatibility->assertStartable();

        $event->settings->holdFor(
            $compatibility->version,
            $compatibility->binaryDigest,
            $compatibility->arrangement->value,
        );

        $this->container->make($compatibility->accountSettings)->fill(
            $event->settings,
            $event->directory,
            $this->config->string('accounts.root'),
            $compatibility,
        );
    }
}
