<?php

declare(strict_types=1);

namespace App\Support\Inputs;

use App\Contracts\Drivers\NativeTurnRecords;
use App\Contracts\Sessions\ConversationVisits;
use App\Enums\AnswerType;
use App\Support\Inputs\Contracts\HookAnswerer;
use App\Support\Inputs\Contracts\HookInput;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\Inputs\Values\StopDetails;
use Carbon\CarbonImmutable;
use PhpOption\None;
use PhpOption\Option;

final readonly class StopRequested implements HookInput
{
    public function __construct(
        public HookIdentity $hook,
        public StopDetails $stop,
    ) {}

    public function identity(): HookIdentity
    {
        return $this->hook;
    }

    public function methodName(): string
    {
        return 'onStop';
    }

    public function accepts(AnswerType $type): bool
    {
        return $type->fitsAStop();
    }

    public function answerBy(HookAnswerer $state): mixed
    {
        return $state->onStop($this);
    }

    public function leavesAgentIdle(AnswerType $type): bool
    {
        return $type === AnswerType::Allow;
    }

    public function contextStart(): Option
    {
        return None::create();
    }

    public function recordVisit(ConversationVisits $visits, string $sessionId, CarbonImmutable $at): void {}

    public function recordTurn(NativeTurnRecords $turns, string $sessionId, int|null $generation): void {}
}
