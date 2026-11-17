<?php

declare(strict_types=1);

namespace App\Core\Hooks\Inputs;

use App\Core\Hooks\Decisions\AnswerKind;
use App\Core\Hooks\Decisions\Decision;

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

    public function accepts(AnswerKind $kind): bool
    {
        return $kind->fitsAShellCommand();
    }

    public function answerBy(HookAnswerer $state): Decision
    {
        return $state->onShellCommand($this);
    }
}
