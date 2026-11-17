<?php

declare(strict_types=1);

namespace App\Core\Hooks\Decisions;

use App\Core\Hooks\Contracts\StackEditor;
use App\Core\Hooks\Contracts\StackTransition;
use App\Core\Hooks\Enums\TransitionType;

final readonly class PushState implements StackTransition
{
    public function __construct(public StateReference $state) {}

    public function type(): TransitionType
    {
        return TransitionType::Push;
    }

    public function applyTo(StackEditor $editor): void
    {
        $editor->pushOverAnsweringState($this->state);
    }
}
