<?php

declare(strict_types=1);

namespace App\Support\Inputs\Contracts;

use App\Agents\Contracts\RunningTools;
use App\Agents\Drivers\Contracts\NativeTurnRecords;
use App\Bus\Contracts\Command;
use App\Contracts\Events\Event;
use App\Hooks\Enums\AnswerType;
use App\Hooks\Enums\ContextStartType;
use App\Sessions\Contracts\ConversationVisits;
use App\Stacks\Decisions\Contracts\AnswerPart;
use App\Stacks\Inputs\Contracts\HookHandler;
use App\Stacks\References\StateReference;
use App\Support\Decisions\Decision;
use App\Support\Inputs\Values\HookIdentity;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;
use PhpOption\Option;

/**
 * One hook call of an agent driver, in the journal's own words; it asks a state for the matching answer.
 */
interface HookInput
{
    /**
     * Who called the hook, in which session, and the call's id and digest.
     */
    public function identity(): HookIdentity;

    /**
     * The name of the state method that answers this hook.
     */
    public function methodName(): string;

    /**
     * Whether this hook can take an answer of that type: only a stop can be prevented, only a shell command rewritten.
     */
    public function accepts(AnswerType $type): bool;

    /**
     * Asks the state for its answer to this hook, by the one method of the state that belongs to it.
     *
     * @return AnswerPart|Command<mixed>|Event|StateReference|iterable<AnswerPart|Command<mixed>|Event|StateReference>
     */
    public function answerBy(HookHandler $state): AnswerPart|Command|Event|StateReference|iterable;

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

    /**
     * Records the tool call the agent's chat line names: a call let run starts it, a finished call finishes it, and a
     * new turn or context clears it; a denied call and any other hook change nothing.
     */
    public function recordTool(RunningTools $tools, StackTarget $target, Decision $decision): void;
}
