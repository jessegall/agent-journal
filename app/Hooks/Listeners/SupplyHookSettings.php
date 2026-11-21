<?php

declare(strict_types=1);

namespace App\Hooks\Listeners;

use App\Agents\Events\StartSettingsRequested;
use App\Contracts\Listener;
use App\Drivers\Enums\HookDriver;

/**
 * Adds the journal's hooks for a program it supports to the start's isolated settings, allows the journal's own MCP
 * tools and turns off its child tools without identity.
 */
final class SupplyHookSettings implements Listener
{
    public function handle(StartSettingsRequested $event): void
    {
        $driver = HookDriver::tryFrom($event->driver);

        if ($driver === null) {
            return;
        }

        foreach ($driver->nativeEvents() as $eventName) {
            $event->settings->addHook($eventName, $driver->hookCommand());
        }

        foreach ($driver->nativeChildTools() as $toolName) {
            $event->settings->denyTool($toolName);
        }

        foreach ($driver->journalToolRules() as $toolRule) {
            $event->settings->allowTool($toolRule);
        }
    }
}
