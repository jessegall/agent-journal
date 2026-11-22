<?php

declare(strict_types=1);

namespace App\Hooks\Inputs\Contracts;

use App\Agents\Contracts\ConversationVisits;
use App\Agents\Contracts\NativeTurnRecords;
use App\Hooks\Enums\AnswerType;
use App\Hooks\Enums\ContextStartType;
use App\Hooks\Inputs\Values\HookIdentity;
use Carbon\CarbonImmutable;
use PhpOption\Option;

/**
 * One hook call of an agent driver, in the journal's own words; it asks a state for the matching answer.
 */
interface HookInput
{
    public function identity(): HookIdentity;

    public function methodName(): string;

    /**
     * Whether this hook can take an answer of that type: only a stop can be prevented, only a shell command rewritten.
     */
    public function accepts(AnswerType $type): bool;

    public function answerBy(HookAnswerer $state): mixed;

    /**
     * Whether an answer of that type leaves the agent idle, so the reply's context reaches nobody: only an allowed stop
     * and a session's end do.
     */
    public function leavesAgentIdle(AnswerType $type): bool;

    /**
     * How this hook starts the agent's context, for a session start or a compaction; any other hook starts none.
     *
     * @return Option<ContextStartType>
     */
    public function contextStart(): Option;

    /**
     * Records the agent's visit to its driver conversation, for a session start or a compaction.
     */
    public function recordVisit(ConversationVisits $visits, string $sessionId, CarbonImmutable $at): void;

    /**
     * Records the native turn this hook starts, for a submitted prompt; any other hook starts none.
     */
    public function recordTurn(NativeTurnRecords $turns, string $sessionId, int|null $generation): void;
}
