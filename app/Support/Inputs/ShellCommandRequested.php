<?php

declare(strict_types=1);

namespace App\Support\Inputs;

use App\Contracts\Bus\Command;
use App\Contracts\Drivers\NativeTurnRecords;
use App\Contracts\Events\Event;
use App\Contracts\Sessions\ConversationVisits;
use App\Enums\Hooks\AnswerType;
use App\Support\Decisions\Contracts\AnswerPart;
use App\Support\Inputs\Contracts\HookHandler;
use App\Support\Inputs\Contracts\HookInput;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\References\StateReference;
use App\Values\ShellCommand;
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
}
