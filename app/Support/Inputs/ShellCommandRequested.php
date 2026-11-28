<?php

declare(strict_types=1);

namespace App\Support\Inputs;

use App\Agents\Contracts\RunningTools;
use App\Agents\Drivers\Contracts\NativeTurnRecords;
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
use App\Values\ShellCommand;
use App\Values\StackTarget;
use App\Values\ToolLine;
use Carbon\CarbonImmutable;
use PhpOption\None;
use PhpOption\Option;

final readonly class ShellCommandRequested implements HookInput
{
    public function __construct(
        public HookIdentity $hook,
        public ShellCommand $command,
    ) {}

    /**
     * The same hook call asking about a replacement command.
     */
    public function replacedBy(ShellCommand $command): self
    {
        return new self($this->hook, $command);
    }

    public function identity(): HookIdentity
    {
        return $this->hook;
    }

    /**
     * Whether the whole command line only reads, which no state ever denies.
     */
    public function isReadOnly(): bool
    {
        return $this->command->readsOnly();
    }

    public function methodName(): string
    {
        return 'onShellCommand';
    }

    public function accepts(AnswerType $type): bool
    {
        return $type->fitsAShellCommand();
    }

    /**
     * @return AnswerPart|Command<mixed>|Event|StateReference|iterable<AnswerPart|Command<mixed>|Event|StateReference>
     */
    public function answerBy(HookHandler $state): AnswerPart|Command|Event|StateReference|iterable
    {
        return $state->onShellCommand($this);
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

    public function recordTool(RunningTools $tools, StackTarget $target, Decision $decision): void
    {
        if ($decision->answerType() === AnswerType::Deny) {
            return;
        }

        $line = $decision->answerType() === AnswerType::Rewrite
            ? ToolLine::rewritten($decision->replacementLine())
            : ToolLine::shell($this->command->source);

        $tools->started($target, $line);
    }
}
