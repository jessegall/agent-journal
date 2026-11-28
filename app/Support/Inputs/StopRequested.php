<?php

declare(strict_types=1);

namespace App\Support\Inputs;

use App\Agents\Contracts\RunningTools;
use App\Agents\Drivers\Contracts\NativeTurnRecords;
use App\Agents\Inputs\Values\StopDetails;
use App\Bus\Contracts\Command;
use App\Contracts\Events\Event;
use App\Hooks\Enums\AnswerType;
use App\Sessions\Contracts\ConversationVisits;
use App\Stacks\Decisions\Contracts\AnswerPart;
use App\Stacks\Inputs\Contracts\HookHandler;
use App\Stacks\References\StateReference;
use App\Support\Decisions\Decision;
use App\Support\Inputs\Contracts\HookInput;
use App\Support\Inputs\Values\HookIdentity;
use App\Values\StackTarget;
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
        return $type->fitsWithoutRewrite();
    }

    /**
     * @return AnswerPart|Command<mixed>|Event|StateReference|iterable<AnswerPart|Command<mixed>|Event|StateReference>
     */
    public function answerBy(HookHandler $state): AnswerPart|Command|Event|StateReference|iterable
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

    public function recordTool(RunningTools $tools, StackTarget $target, Decision $decision): void
    {
        $tools->cleared($target);
    }
}
