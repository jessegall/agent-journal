<?php

declare(strict_types=1);

namespace App\Hooks\Decisions;

use App\Hooks\Contracts\StackEditor;
use App\Hooks\Contracts\StackTransition;
use App\Hooks\Enums\TransitionType;

final readonly class PushTransition implements StackTransition
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
