<?php

declare(strict_types=1);

namespace App\Hooks\Enums;

use App\Hooks\Contracts\StackEditor;
use App\Hooks\Contracts\StackTransition;

enum SimpleTransition: string implements StackTransition
{
    case Keep = 'keep';
    case PopSelf = 'pop_self';

    public function type(): TransitionType
    {
        return match ($this) {
            self::Keep => TransitionType::Keep,
            self::PopSelf => TransitionType::PopSelf,
        };
    }

    public function applyTo(StackEditor $editor): void
    {
        if ($this === self::PopSelf) {
            $editor->popAnsweringState();
        }
    }
}
