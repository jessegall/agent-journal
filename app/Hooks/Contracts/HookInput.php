<?php

declare(strict_types=1);

namespace App\Hooks\Contracts;

use App\Agents\Contracts\ConversationVisits;
use App\Hooks\Decisions\Decision;
use App\Hooks\Enums\AnswerType;
use App\Hooks\Enums\ContextStartType;
use App\Hooks\Inputs\HookIdentity;
use Carbon\CarbonImmutable;
use PhpOption\Option;

/**
 * One hook call of an agent program, in the journal's own words; it asks a state for the matching answer.
 */
interface HookInput
{
    public function identity(): HookIdentity;

    public function methodName(): string;

    /**
     * Whether this hook can take an answer of that type: only a stop can be prevented, only a shell command rewritten.
     */
    public function accepts(AnswerType $type): bool;

    public function answerBy(HookAnswerer $state): Decision;

    /**
     * How this hook starts the agent's context, for a session start or a compaction; any other hook starts none.
     *
     * @return Option<ContextStartType>
     */
    public function contextStart(): Option;

    /**
     * Records the agent's visit to its program conversation, for a session start or a compaction.
     */
    public function recordVisit(ConversationVisits $visits, string $sessionId, CarbonImmutable $at): void;
}
