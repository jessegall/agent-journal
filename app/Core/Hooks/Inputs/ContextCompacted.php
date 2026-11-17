<?php

declare(strict_types=1);

namespace App\Core\Hooks\Inputs;

use App\Core\Hooks\Contracts\HookAnswerer;
use App\Core\Hooks\Contracts\HookInput;
use App\Core\Hooks\Decisions\Decision;
use App\Core\Hooks\Enums\AnswerType;

final readonly class ContextCompacted implements HookInput
{
    public function __construct(
        public HookIdentity $hook,
        public CompactionDetails $compaction,
    ) {}

    public function compactionId(): string
    {
        return $this->compaction->compactionId;
    }

    public function identity(): HookIdentity
    {
        return $this->hook;
    }

    public function methodName(): string
    {
        return 'onCompaction';
    }

    public function accepts(AnswerType $type): bool
    {
        return $type->fitsEveryHook();
    }

    public function answerBy(HookAnswerer $state): Decision
    {
        return $state->onCompaction($this);
    }
}
