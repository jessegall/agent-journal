<?php

declare(strict_types=1);

namespace App\Core\Hooks\Listeners;

use App\Core\Agents\Events\LaunchSettingsRequested;
use App\Core\Hooks\Enums\HookProgram;

/**
 * Adds the journal's hooks for a program it supports to the launch's isolated settings, and turns off its child tools without identity.
 */
final class SupplyHookSettings
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

        foreach ($program->childToolsWithoutIdentity() as $toolName) {
            $event->settings->denyTool($toolName);
        }
    }
}
