<?php

declare(strict_types=1);

namespace App\Hooks\Inputs;

use App\Hooks\Contracts\HookAnswerer;
use App\Hooks\Contracts\HookInput;
use App\Hooks\Decisions\Decision;
use App\Hooks\Enums\AnswerType;
use App\Processes\Values\ShellCommand;

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

    public function methodName(): string
    {
        return 'onShellCommand';
    }

    public function accepts(AnswerType $type): bool
    {
        return $type->fitsAShellCommand();
    }

    public function answerBy(HookAnswerer $state): Decision
    {
        return $state->onShellCommand($this);
    }
}
