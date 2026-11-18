<?php

declare(strict_types=1);

namespace App\Hooks\Contracts;

use App\Hooks\Enums\TransitionType;

/**
 * What an answer does to the stack: keep it, pop the answering state, or push a new state.
 */
interface StackTransition
{
    public function type(): TransitionType;

    public function applyTo(StackEditor $editor): void;
}
