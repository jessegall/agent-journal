<?php

declare(strict_types=1);

namespace App\Hooks\Listeners;

use App\Agents\Events\AccountSettingsRequested;
use App\Contracts\Listener;
use App\Drivers\Enums\HookDriver;
use App\Hooks\Contracts\DriverCompatibilities;
use App\Hooks\Drivers\ClaudeAccountSettings;
use App\Hooks\Drivers\CodexAccountSettings;
use Illuminate\Contracts\Config\Repository;

/**
 * Fills in a claimed start's account settings for a program the journal runs, from its pinned compatibility; a build
 * or arrangement the real program has not shown refuses the claim, so no process starts.
 */
final class SupplyAccountSettings implements Listener
{
    public function __construct(
        private DriverCompatibilities $compatibilities,
        private Repository $config,
    ) {}

    public function handle(AccountSettingsRequested $event): void
    {
        $driver = HookDriver::tryFrom($event->driver);

        if ($driver === null) {
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
            HookDriver::ClaudeCode => ClaudeAccountSettings::fill(
                $event->settings,
                $event->directory,
                $this->config->string('accounts.root'),
                $compatibility->startFlags,
            ),
            HookDriver::Codex => CodexAccountSettings::fill(
                $event->settings,
                $event->directory,
                $this->config->string('accounts.root'),
                $compatibility->startFlags,
                $compatibility->settings,
            ),
        };
    }
}
