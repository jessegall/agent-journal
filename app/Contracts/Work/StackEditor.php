<?php

declare(strict_types=1);

namespace App\Contracts\Work;

use App\Support\References\StateReference;

/**
 * The stack as one answering state may change it: remove itself, or put a new state over itself.
 */
interface StackEditor
{
    public function popAnsweringState(): void;

    public function pushOverAnsweringState(StateReference $state): void;
}
