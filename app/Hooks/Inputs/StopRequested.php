<?php

declare(strict_types=1);

namespace App\Hooks\Inputs;

use App\Hooks\Contracts\HookAnswerer;
use App\Hooks\Contracts\HookInput;
use App\Hooks\Decisions\Decision;
use App\Hooks\Enums\AnswerType;

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

    public function accepts(AnswerType $type): bool
    {
        return $type->fitsAStop();
    }

    public function answerBy(HookAnswerer $state): Decision
    {
        return $state->onStop($this);
    }
}
