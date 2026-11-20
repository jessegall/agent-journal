<?php

declare(strict_types=1);

namespace App\Scripts\Values;

final readonly class TriggerPolicy
{
    public function __construct(
        public string $fallthrough,
        public string $failure,
        public string $returnToActor,
    ) {}
}
