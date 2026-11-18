<?php

declare(strict_types=1);

namespace App\Hooks\Enums;

use App\Agents\Enums\AgentRole;
use App\Hooks\Contracts\StateLoader;
use App\Hooks\Decisions\StateReferences;
use App\Hooks\Decisions\StateSet;
use App\Hooks\Exceptions\UnknownReadyState;
use App\Hooks\States\MainAgentReadyState;
use App\Hooks\States\ReadOnlyHelperReadyState;
use App\Hooks\States\ReadyState;
use App\Hooks\States\WritingHelperReadyState;

/**
 * The built-in bottom states, one for each checked role, under the type keys they are stored by.
 */
enum ReadyStateType: string implements StateLoader
{
    case MainAgent = AgentRole::MainAgent->value;
    case ReadOnlyHelper = AgentRole::ReadOnlyHelper->value;
    case WritingHelper = AgentRole::WritingHelper->value;

    public static function forKey(string $typeKey): self
    {
        return self::tryFrom($typeKey) ?? throw UnknownReadyState::forKey($typeKey);
    }

    public function statesFor(StateReferences $references): StateSet
    {
        return StateSet::build($references, fn () => $this->newState());
    }

    public function schemaVersion(): int
    {
        return 1;
    }

    public function newState(): ReadyState
    {
        return match ($this) {
            self::MainAgent => new MainAgentReadyState(),
            self::ReadOnlyHelper => new ReadOnlyHelperReadyState(),
            self::WritingHelper => new WritingHelperReadyState(),
        };
    }
}
