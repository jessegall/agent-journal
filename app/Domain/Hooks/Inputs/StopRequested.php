<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Inputs;

use App\Domain\Hooks\Decisions\Decision;

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

    public function answerBy(HookAnswerer $state): Decision
    {
        return $state->onStop($this);
    }
}
