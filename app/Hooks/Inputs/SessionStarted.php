<?php

declare(strict_types=1);

namespace App\Hooks\Inputs;

use App\Agents\Contracts\ConversationVisits;
use App\Agents\Contracts\NativeTurnRecords;
use App\Hooks\Contracts\HookAnswerer;
use App\Hooks\Contracts\HookInput;
use App\Hooks\Decisions\Decision;
use App\Hooks\Enums\AnswerType;
use Carbon\CarbonImmutable;
use PhpOption\Option;
use PhpOption\Some;

final readonly class SessionStarted implements HookInput
{
    public function __construct(
        public HookIdentity $hook,
        public SessionStartDetails $start,
    ) {}

    public function identity(): HookIdentity
    {
        return $this->hook;
    }

    public function methodName(): string
    {
        return 'onSessionStart';
    }

    public function accepts(AnswerType $type): bool
    {
        return $type->fitsEveryHook();
    }

    public function answerBy(HookAnswerer $state): Decision
    {
        return $state->onSessionStart($this);
    }

    public function leavesAgentIdle(AnswerType $type): bool
    {
        return false;
    }

    public function contextStart(): Option
    {
        return Some::create($this->start->source);
    }

    public function recordVisit(ConversationVisits $visits, string $sessionId, CarbonImmutable $at): void
    {
        $visits->entered(
            $sessionId,
            $this->start->vendorSessionId,
            $this->start->transcriptPath,
            $this->hook->hookId,
            $at,
        );
    }

    public function recordTurn(NativeTurnRecords $turns, string $sessionId, int|null $generation): void {}
}
