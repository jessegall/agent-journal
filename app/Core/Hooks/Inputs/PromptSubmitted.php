<?php

declare(strict_types=1);

namespace App\Core\Hooks\Inputs;

use App\Core\Hooks\Contracts\HookAnswerer;
use App\Core\Hooks\Contracts\HookInput;
use App\Core\Hooks\Decisions\Decision;
use App\Core\Hooks\Enums\AnswerKind;

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

    public function accepts(AnswerKind $kind): bool
    {
        return $kind->fitsAnAction();
    }

    public function answerBy(HookAnswerer $state): Decision
    {
        return $state->onPrompt($this);
    }
}
