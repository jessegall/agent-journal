<?php

declare(strict_types=1);

namespace App\Core\Hooks\Contracts;

use App\Core\Hooks\Enums\TransitionType;

/**
 * What an answer does to the stack: keep it, pop the answering state, or push a new state.
 */
interface StackTransition
{
    public function type(): TransitionType;

    public function applyTo(StackEditor $editor): void;
}
