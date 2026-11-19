<?php

declare(strict_types=1);

namespace App\Hooks\Listeners;

use App\Agents\Events\LaunchSettingsRequested;
use App\Contracts\Listener;
use App\Programs\Enums\HookProgram;

/**
 * Adds the journal's hooks for a program it supports to the launch's isolated settings, and turns off its child tools
 * without identity.
 */
final class SupplyHookSettings implements Listener
{
    public function handle(LaunchSettingsRequested $event): void
    {
        $program = HookProgram::tryFrom($event->program);

        if ($program === null) {
            return;
        }

        foreach ($program->nativeEvents() as $eventName) {
            $event->settings->addHook($eventName, $program->hookCommand());
        }

        foreach ($program->nativeChildTools() as $toolName) {
            $event->settings->denyTool($toolName);
        }
    }
}
