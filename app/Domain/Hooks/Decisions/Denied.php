<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Decisions;

final readonly class Denied implements Answer
{
    public function __construct(public Reason $reason) {}

    public function label(): string
    {
        return 'deny';
    }
}
