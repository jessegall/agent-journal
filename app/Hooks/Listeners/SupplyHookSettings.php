<?php

declare(strict_types=1);

namespace App\Hooks\Listeners;

use App\Agents\Events\StartSettingsRequested;
use App\Contracts\Listener;
use App\Drivers\Enums\HookDriver;
use App\Hooks\Drivers\Contracts\DriverAdapters;

/**
 * Adds the journal's hooks for a driver it supports to the start's isolated settings, allows the journal's own MCP
 * tools and turns off its child tools without identity.
 */
final readonly class SupplyHookSettings implements Listener
{
    public function __construct(private DriverAdapters $adapters) {}

    public function handle(StartSettingsRequested $event): void
    {
        $driver = HookDriver::tryFrom($event->driver);

        if ($driver === null) {
            return;
        }

        $adapter = $this->adapters->for($driver->value);

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
