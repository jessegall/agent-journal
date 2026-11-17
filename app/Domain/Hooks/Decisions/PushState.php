<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Decisions;

use App\Domain\Hooks\StateReference;

final readonly class PushState implements StackChange
{
    public function __construct(public StateReference $state) {}

    public function label(): string
    {
        return 'push';
    }
}
