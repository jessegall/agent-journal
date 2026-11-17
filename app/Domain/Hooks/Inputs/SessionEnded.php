<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Inputs;

use App\Domain\Hooks\Decisions\Decision;

final readonly class SessionEnded implements HookInput
{
    public function __construct(
        public HookIdentity $hook,
        public SessionEndDetails $end,
    ) {}

    public function identity(): HookIdentity
    {
        return $this->hook;
    }

    public function methodName(): string
    {
        return 'onSessionEnd';
    }

    public function answerBy(HookAnswerer $state): Decision
    {
        return $state->onSessionEnd($this);
    }
}
