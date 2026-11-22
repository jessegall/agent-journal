<?php

declare(strict_types=1);

namespace App\Support\Inputs;

use App\Contracts\Drivers\NativeTurnRecords;
use App\Contracts\Sessions\ConversationVisits;
use App\Enums\AnswerType;
use App\Enums\ContextStartType;
use App\Support\Inputs\Contracts\HookAnswerer;
use App\Support\Inputs\Contracts\HookInput;
use App\Support\Inputs\Values\CompactionDetails;
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

    public function answerBy(HookAnswerer $state): mixed
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
