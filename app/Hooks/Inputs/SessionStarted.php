<?php

declare(strict_types=1);

namespace App\Hooks\Inputs;

use App\Hooks\Contracts\HookAnswerer;
use App\Hooks\Contracts\HookInput;
use App\Hooks\Decisions\Decision;
use App\Hooks\Enums\AnswerType;

final readonly class SessionStarted implements HookInput
{
    public function __construct(
        public HookIdentity $hook,
        public SessionStartDetails $start,
    ) {}

    public function identity(): HookIdentity
    {
        return $this->hook;
    }

    public function methodName(): string
    {
        return 'onSessionStart';
    }

    public function accepts(AnswerType $type): bool
    {
        return $type->fitsEveryHook();
    }

    public function answerBy(HookAnswerer $state): Decision
    {
        return $state->onSessionStart($this);
    }
}
