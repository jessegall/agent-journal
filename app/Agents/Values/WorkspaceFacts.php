<?php

declare(strict_types=1);

namespace App\Agents\Values;

final readonly class WorkspaceFacts
{
    public function __construct(
        public bool $isAvailable,
        public bool $isDirty,
        public bool $isClean,
    ) {}
}
