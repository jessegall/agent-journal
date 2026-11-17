<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Decisions;

enum SimpleChange: string implements StackChange
{
    case Keep = 'keep';
    case PopSelf = 'pop_self';

    public function kind(): ChangeKind
    {
        return match ($this) {
            self::Keep => ChangeKind::Keep,
            self::PopSelf => ChangeKind::PopSelf,
        };
    }

    public function applyTo(StackEditor $editor): void
    {
        if ($this === self::PopSelf) {
            $editor->popAnsweringState();
        }
    }
}
