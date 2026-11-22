<?php

declare(strict_types=1);

namespace App\Support\Inputs;

use App\Contracts\ConversationVisits;
use App\Contracts\NativeTurnRecords;
use App\Enums\AnswerType;
use App\Support\Inputs\Contracts\HookAnswerer;
use App\Support\Inputs\Contracts\HookInput;
use App\Support\Inputs\Values\HookIdentity;
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

    public function methodName(): string
    {
        return 'onToolRequested';
    }

    public function accepts(AnswerType $type): bool
    {
        return $type->fitsAnAction();
    }

    public function answerBy(HookAnswerer $state): mixed
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
