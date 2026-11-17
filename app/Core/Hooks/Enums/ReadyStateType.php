<?php

declare(strict_types=1);

namespace App\Core\Hooks\Enums;

use App\Core\Agents\Enums\AgentRole;
use App\Core\Hooks\Contracts\StateType;
use App\Core\Hooks\Decisions\StateReference;
use App\Core\Hooks\Exceptions\UnknownReadyState;
use App\Core\Hooks\States\AgentState;
use App\Core\Hooks\States\MainAgentReadyState;
use App\Core\Hooks\States\ReadOnlyHelperReadyState;
use App\Core\Hooks\States\ReadyState;

/**
 * The built-in bottom states, one for each checked role, under the type keys they are stored by.
 */
enum ReadyStateType: string implements StateType
{
    case MainAgent = AgentRole::MainAgent->value;
    case ReadOnlyHelper = AgentRole::ReadOnlyHelper->value;

    public static function forKey(string $typeKey): self
    {
        return self::tryFrom($typeKey) ?? throw UnknownReadyState::forKey($typeKey);
    }

    public function stateFor(StateReference $reference): AgentState
    {
        return $this->newState();
    }

    public function schemaVersion(): int
    {
        return 1;
    }

    public function newState(): ReadyState
    {
        return match ($this) {
            self::MainAgent => new MainAgentReadyState,
            self::ReadOnlyHelper => new ReadOnlyHelperReadyState,
        };
    }
}
