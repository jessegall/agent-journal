<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Decisions;

enum SimpleChange: string implements StackChange
{
    case Keep = 'keep';
    case PopSelf = 'pop_self';

    public function label(): string
    {
        return $this->value;
    }
}
