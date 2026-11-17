<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Decisions;

/**
 * What an answer does to the stack: keep it, pop the answering state, or push a new state.
 */
interface StackChange
{
    public function kind(): ChangeKind;

    public function applyTo(StackEditor $editor): void;
}
