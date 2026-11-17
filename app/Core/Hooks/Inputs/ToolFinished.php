<?php

declare(strict_types=1);

namespace App\Core\Hooks\Inputs;

use App\Core\Hooks\Decisions\AnswerKind;
use App\Core\Hooks\Decisions\Decision;

final readonly class ToolFinished implements HookInput
{
    public function __construct(
        public HookIdentity $hook,
        public ToolResult $result,
    ) {}

    public function identity(): HookIdentity
    {
        return $this->hook;
    }

    public function methodName(): string
    {
        return 'onToolFinished';
    }

    public function accepts(AnswerKind $kind): bool
    {
        return $kind->fitsEveryHook();
    }

    public function answerBy(HookAnswerer $state): Decision
    {
        return $state->onToolFinished($this);
    }
}
