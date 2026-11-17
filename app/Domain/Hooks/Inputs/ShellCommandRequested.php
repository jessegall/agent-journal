<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Inputs;

use App\Domain\Hooks\Decisions\Decision;

final readonly class ShellCommandRequested implements HookInput
{
    public function __construct(
        public HookIdentity $hook,
        public ShellCommand $command,
    ) {}

    public function identity(): HookIdentity
    {
        return $this->hook;
    }

    public function methodName(): string
    {
        return 'onShellCommand';
    }

    public function answerBy(HookAnswerer $state): Decision
    {
        return $state->onShellCommand($this);
    }
}
