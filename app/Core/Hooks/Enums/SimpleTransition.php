<?php

declare(strict_types=1);

namespace App\Core\Hooks\Enums;

use App\Core\Hooks\Contracts\StackEditor;
use App\Core\Hooks\Contracts\StackTransition;

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
