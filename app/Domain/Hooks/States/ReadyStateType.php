<?php

declare(strict_types=1);

namespace App\Domain\Hooks\States;

/**
 * The built-in bottom states, one for each checked role, under the type keys they are stored by.
 */
enum ReadyStateType: string
{
    case MainAgent = 'hooks.main_ready';
    case ReadOnlyHelper = 'hooks.read_only_helper_ready';

    public static function forKey(string $typeKey): self
    {
        return self::tryFrom($typeKey) ?? throw UnknownReadyState::forKey($typeKey);
    }

    public function newState(): Ready
    {
        return match ($this) {
            self::MainAgent => new MainAgentReady,
            self::ReadOnlyHelper => new ReadOnlyHelperReady,
        };
    }
}
