<?php

declare(strict_types=1);

namespace App\Core\Hooks\Contracts;

use App\Core\Hooks\Enums\TransitionKind;

/**
 * What an answer does to the stack: keep it, pop the answering state, or push a new state.
 */
interface StackTransition
{
    public function kind(): TransitionKind;

    public function applyTo(StackEditor $editor): void;
}
