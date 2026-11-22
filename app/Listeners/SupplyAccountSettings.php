<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\DriverCatalogue;
use App\Contracts\DriverCompatibilities;
use App\Contracts\Listener;
use App\Events\AccountSettingsRequested;
use App\Exceptions\DriverFamilyUnknown;
use App\Support\DefaultDrivers;
use App\Support\Drivers\ClaudeAccountSettings;
use App\Support\Drivers\CodexAccountSettings;
use Illuminate\Contracts\Config\Repository;

/**
 * Fills in a claimed start's account settings for a driver the journal runs, from its pinned compatibility; a build
 * or arrangement the real driver has not shown refuses the claim, so no process starts.
 */
final class SupplyAccountSettings implements Listener
{
    public function __construct(
        private DriverCompatibilities $compatibilities,
        private Repository $config,
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

        match ($driver) {
            DefaultDrivers::CLAUDE_CODE => ClaudeAccountSettings::fill(
                $event->settings,
                $event->directory,
                $this->config->string('accounts.root'),
                $compatibility->startFlags,
            ),
            DefaultDrivers::CODEX => CodexAccountSettings::fill(
                $event->settings,
                $event->directory,
                $this->config->string('accounts.root'),
                $compatibility->startFlags,
                $compatibility->settings,
            ),
            default => throw DriverFamilyUnknown::for($driver),
        };
    }
}
