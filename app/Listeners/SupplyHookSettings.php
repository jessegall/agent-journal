<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Drivers\DriverCatalogue;
use App\Contracts\Events\Listener;
use App\Events\Sessions\StartSettingsRequested;
use App\Support\Drivers\Contracts\DriverAdapters;

/**
 * Adds the journal's hooks for a driver it supports to the start's isolated settings, allows the journal's own MCP
 * tools and turns off its child tools without identity.
 */
final readonly class SupplyHookSettings implements Listener
{
    public function __construct(private DriverAdapters $adapters, private DriverCatalogue $drivers) {}

    public function handle(StartSettingsRequested $event): void
    {
        if (! $this->drivers->hasFamily($event->driver)) {
            return;
        }

        $adapter = $this->adapters->for($event->driver);

        foreach ($adapter->nativeEvents() as $eventName) {
            $event->settings->addHook($eventName, $adapter->hookCommand());
        }

        foreach ($adapter->nativeChildTools() as $toolName) {
            $event->settings->denyTool($toolName);
        }

        foreach ($adapter->journalToolRules() as $toolRule) {
            $event->settings->allowTool($toolRule);
        }
    }
}
