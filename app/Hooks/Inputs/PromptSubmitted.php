<?php

declare(strict_types=1);

namespace App\Hooks\Inputs;

use App\Hooks\Contracts\HookAnswerer;
use App\Hooks\Contracts\HookInput;
use App\Hooks\Decisions\Decision;
use App\Hooks\Enums\AnswerType;

final readonly class PromptSubmitted implements HookInput
{
    public function __construct(
        public HookIdentity $hook,
        public PromptDetails $prompt,
    ) {}

    public function identity(): HookIdentity
    {
        return $this->hook;
    }

    public function methodName(): string
    {
        return 'onPrompt';
    }

    public function accepts(AnswerType $type): bool
    {
        return $type->fitsAnAction();
    }

    public function answerBy(HookAnswerer $state): Decision
    {
        return $state->onPrompt($this);
    }
}
