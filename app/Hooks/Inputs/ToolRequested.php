<?php

declare(strict_types=1);

namespace App\Hooks\Inputs;

use App\Agents\Contracts\ConversationVisits;
use App\Agents\Contracts\NativeTurnRecords;
use App\Agents\Values\Operation;
use App\Hooks\Decisions\Decision;
use App\Hooks\Enums\AnswerType;
use App\Hooks\Inputs\Contracts\HookAnswerer;
use App\Hooks\Inputs\Contracts\HookInput;
use App\Hooks\Inputs\Values\HookIdentity;
use Carbon\CarbonImmutable;
use PhpOption\None;
use PhpOption\Option;

/**
 * A native tool call that is neither a shell command nor a file edit, such as a read, a search, a web fetch or an MCP
 * tool, with the operation its program adapter declared for it.
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

    public function answerBy(HookAnswerer $state): Decision
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
