<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Inputs;

use App\Domain\Hooks\Decisions\AnswerKind;
use App\Domain\Hooks\Decisions\Decision;

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

    public function accepts(AnswerKind $kind): bool
    {
        return $kind->fitsEveryHook();
    }

    public function answerBy(HookAnswerer $state): Decision
    {
        return $state->onSessionStart($this);
    }
}
