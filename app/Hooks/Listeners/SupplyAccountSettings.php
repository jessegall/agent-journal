<?php

declare(strict_types=1);

namespace App\Hooks\Listeners;

use App\Agents\Events\AccountSettingsRequested;
use App\Contracts\Listener;
use App\Hooks\Contracts\ProgramCompatibilities;
use App\Hooks\Programs\ClaudeAccountSettings;
use App\Hooks\Programs\CodexAccountSettings;
use App\Programs\Enums\HookProgram;
use Illuminate\Contracts\Config\Repository;

/**
 * Fills in a claimed start's account settings for a program the journal runs, from its pinned compatibility; a build
 * or arrangement the real program has not shown refuses the claim, so no process starts.
 */
final class SupplyAccountSettings implements Listener
{
    public function __construct(
        private ProgramCompatibilities $compatibilities,
        private Repository $config,
    ) {}

    public function handle(AccountSettingsRequested $event): void
    {
        $program = HookProgram::tryFrom($event->program);

        if ($program === null) {
            return;
        }

        $compatibility = $this->compatibilities->for($program);
        $compatibility->requireLaunchable();
        $event->settings->holdFor(
            $compatibility->version,
            $compatibility->binaryDigest,
            $compatibility->arrangement->value,
        );

        match ($program) {
            HookProgram::ClaudeCode => ClaudeAccountSettings::fill(
                $event->settings,
                $event->directory,
                $this->config->string('accounts.root'),
                $compatibility->launchFlags,
            ),
            HookProgram::Codex => CodexAccountSettings::fill(
                $event->settings,
                $event->directory,
                $this->config->string('accounts.root'),
                $compatibility->launchFlags,
                $compatibility->settings,
            ),
        };
    }
}
