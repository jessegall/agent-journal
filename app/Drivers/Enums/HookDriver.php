<?php

declare(strict_types=1);

namespace App\Drivers\Enums;

use App\Drivers\Values\DriverKey;
use App\Drivers\Values\ProviderKey;

/**
 * The agent drivers whose hooks the journal answers, as they appear in the hook endpoint's address.
 */
enum HookDriver: string
{
    case ClaudeCode = 'claude-code';
    case Codex = 'codex';

    public function driverKey(): DriverKey
    {
        return DriverKey::from($this->value);
    }

    /**
     * The provider family the driver runs on, as its registration gives it; never read from a model name.
     */
    public function provider(): ProviderKey
    {
        return match ($this) {
            self::ClaudeCode => ProviderKey::from('anthropic'),
            self::Codex => ProviderKey::from('openai'),
        };
    }

    /**
     * The driver's name as people read it, such as on an account named after it.
     */
    public function displayName(): string
    {
        return match ($this) {
            self::ClaudeCode => 'Claude Code',
            self::Codex => 'Codex',
        };
    }

    /**
     * The name the protected host knows the driver by, as its profiles and its start protocol write it.
     */
    public function hostName(): string
    {
        return match ($this) {
            self::ClaudeCode => 'claude',
            self::Codex => 'codex',
        };
    }

    /**
     * Whether the driver scopes its hooks to one session, as a connected project folder needs to run it isolated;
     * Codex scopes them per installation, not per thread, so it does not yet.
     */
    public function isolatesHooksPerSession(): bool
    {
        return $this === self::ClaudeCode;
    }
}
