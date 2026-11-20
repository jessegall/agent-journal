<?php

declare(strict_types=1);

namespace App\Hooks\Listeners;

use App\Agents\Events\StartSettingsRequested;
use App\Contracts\Listener;
use App\Programs\Enums\HookProgram;

/**
 * Adds the journal's hooks for a program it supports to the start's isolated settings, allows the journal's own MCP
 * tools and turns off its child tools without identity.
 */
final class SupplyHookSettings implements Listener
{
    public function handle(StartSettingsRequested $event): void
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

        foreach ($program->journalToolRules() as $toolRule) {
            $event->settings->allowTool($toolRule);
        }
    }
}
