<?php

declare(strict_types=1);

namespace App\Core\Hooks\Decisions;

use App\Core\Hooks\Contracts\StackChange;
use App\Core\Hooks\Contracts\StackEditor;

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
