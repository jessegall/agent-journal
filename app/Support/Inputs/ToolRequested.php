<?php

declare(strict_types=1);

namespace App\Support\Inputs;

use App\Contracts\Bus\Command;
use App\Contracts\Drivers\NativeTurnRecords;
use App\Contracts\Events\Event;
use App\Contracts\Sessions\ConversationVisits;
use App\Enums\Hooks\AnswerType;
use App\Support\Decisions\Contracts\AnswerPart;
use App\Support\Inputs\Contracts\HookAnswerer;
use App\Support\Inputs\Contracts\HookInput;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\References\StateReference;
use App\Values\Operation;
use Carbon\CarbonImmutable;
use PhpOption\None;
use PhpOption\Option;

/**
 * A native tool call that is neither a shell command nor a file edit, such as a read, a search, a web fetch or an MCP
 * tool, with the operation its driver adapter declared for it.
 */
final readonly class ToolRequested implements HookInput
{
    public function __construct(
        public HookIdentity $hook,
        public Operation $operation,
    ) {}

    public function identity(): HookIdentity
    {
        return $this->hook;
    }

    /**
     * Whether the tool only reads, which no state ever denies.
     */
    public function isReadOnly(): bool
    {
        return $this->operation->readsOnly();
    }

    public function methodName(): string
    {
        return 'onToolRequested';
    }

    public function accepts(AnswerType $type): bool
    {
        return $type->fitsAnAction();
    }

    /**
     * @return AnswerPart|Command<mixed>|Event|StateReference|iterable<AnswerPart|Command<mixed>|Event|StateReference>
     */
    public function answerBy(HookAnswerer $state): AnswerPart|Command|Event|StateReference|iterable
    {
        return $state->onToolRequested($this);
    }

    public function leavesAgentIdle(AnswerType $type): bool
    {
        return false;
    }

    public function contextStart(): Option
    {
        return None::create();
    }

    public function recordVisit(ConversationVisits $visits, string $sessionId, CarbonImmutable $at): void {}

    public function recordTurn(NativeTurnRecords $turns, string $sessionId, int|null $generation): void {}
}
