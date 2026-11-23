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
use App\Support\Inputs\Values\SessionEndDetails;
use Carbon\CarbonImmutable;
use PhpOption\None;
use PhpOption\Option;

final readonly class SessionEnded implements HookInput
{
    public function __construct(
        public HookIdentity $hook,
        public SessionEndDetails $end,
    ) {}

    public function identity(): HookIdentity
    {
        return $this->hook;
    }

    public function methodName(): string
    {
        return 'onSessionEnd';
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
        return $state->onSessionEnd($this);
    }

    public function leavesAgentIdle(AnswerType $type): bool
    {
        return true;
    }

    public function contextStart(): Option
    {
        return None::create();
    }

    public function recordVisit(ConversationVisits $visits, string $sessionId, CarbonImmutable $at): void {}

    public function recordTurn(NativeTurnRecords $turns, string $sessionId, int|null $generation): void {}
}
