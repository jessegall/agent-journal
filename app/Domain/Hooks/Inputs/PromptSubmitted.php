<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Inputs;

use App\Domain\Hooks\Decisions\Decision;

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

    public function answerBy(HookAnswerer $state): Decision
    {
        return $state->onPrompt($this);
    }
}
