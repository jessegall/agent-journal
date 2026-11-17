<?php

declare(strict_types=1);

namespace App\Core\Hooks\Decisions;

final readonly class PushState implements StackChange
{
    public function __construct(public StateReference $state) {}

    public function kind(): ChangeKind
    {
        return ChangeKind::Push;
    }

    public function applyTo(StackEditor $editor): void
    {
        $editor->pushOverAnsweringState($this->state);
    }
}
