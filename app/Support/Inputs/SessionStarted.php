<?php

declare(strict_types=1);

namespace App\Support\Inputs;

use App\Contracts\Bus\Command;
use App\Contracts\Drivers\NativeTurnRecords;
use App\Contracts\Events\Event;
use App\Contracts\Sessions\ConversationVisits;
use App\Enums\AnswerType;
use App\Support\Decisions\Contracts\AnswerPart;
use App\Support\Inputs\Contracts\HookAnswerer;
use App\Support\Inputs\Contracts\HookInput;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\Inputs\Values\SessionStartDetails;
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

    /**
     * @return AnswerPart|Command<mixed>|Event|iterable<AnswerPart|Command<mixed>|Event>
     */
    public function answerBy(HookAnswerer $state): AnswerPart|Command|Event|iterable
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
