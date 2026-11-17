<?php

declare(strict_types=1);

namespace App\Core\Hooks\Decisions;

use App\Core\Hooks\Contracts\StackEditor;
use App\Core\Hooks\Contracts\StackTransition;
use App\Core\Hooks\Enums\TransitionKind;

final readonly class PushState implements StackTransition
{
    public function __construct(public StateReference $state) {}

    public function kind(): TransitionKind
    {
        return TransitionKind::Push;
    }

    public function applyTo(StackEditor $editor): void
    {
        $editor->pushOverAnsweringState($this->state);
    }
}
