<?php

declare(strict_types=1);

namespace App\Core\Hooks\Inputs;

use App\Core\Hooks\Decisions\AnswerKind;
use App\Core\Hooks\Decisions\Decision;

final readonly class FileEditRequested implements HookInput
{
    public function __construct(
        public HookIdentity $hook,
        public FileChanges $changes,
    ) {}

    public function identity(): HookIdentity
    {
        return $this->hook;
    }

    public function methodName(): string
    {
        return 'onFileEdit';
    }

    public function accepts(AnswerKind $kind): bool
    {
        return $kind->fitsAnAction();
    }

    public function answerBy(HookAnswerer $state): Decision
    {
        return $state->onFileEdit($this);
    }
}
