<?php

declare(strict_types=1);

namespace App\Support\Inputs;

use App\Agents\Drivers\Contracts\NativeTurnRecords;
use App\Agents\Inputs\Values\CompactionDetails;
use App\Bus\Contracts\Command;
use App\Contracts\Events\Event;
use App\Hooks\Enums\AnswerType;
use App\Hooks\Enums\ContextStartType;
use App\Sessions\Contracts\ConversationVisits;
use App\Stacks\Decisions\Contracts\AnswerPart;
use App\Stacks\Inputs\Contracts\HookHandler;
use App\Stacks\References\StateReference;
use App\Support\Inputs\Contracts\HookInput;
use App\Support\Inputs\Values\HookIdentity;
use Carbon\CarbonImmutable;
use PhpOption\Option;
use PhpOption\Some;

final readonly class ContextCompacted implements HookInput
{
    public function __construct(
        public HookIdentity $hook,
        public CompactionDetails $compaction,
    ) {}

    public function compactionId(): string
    {
        return $this->compaction->compactionId;
    }

    public function identity(): HookIdentity
    {
        return $this->hook;
    }

    public function methodName(): string
    {
        return 'onCompaction';
    }

    public function accepts(AnswerType $type): bool
    {
        return $type->fitsEveryHook();
    }

    /**
     * @return AnswerPart|Command<mixed>|Event|StateReference|iterable<AnswerPart|Command<mixed>|Event|StateReference>
     */
    public function answerBy(HookHandler $state): AnswerPart|Command|Event|StateReference|iterable
    {
        return $state->onCompaction($this);
    }

    public function leavesAgentIdle(AnswerType $type): bool
    {
        return false;
    }

    public function contextStart(): Option
    {
        return Some::create(ContextStartType::Compact);
    }

    public function recordVisit(ConversationVisits $visits, string $sessionId, CarbonImmutable $at): void
    {
        $visits->compacted($sessionId, $this->hook->hookId, $at);
    }

    public function recordTurn(NativeTurnRecords $turns, string $sessionId, int|null $generation): void {}
}
