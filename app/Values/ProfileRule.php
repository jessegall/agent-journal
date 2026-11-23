<?php

declare(strict_types=1);

namespace App\Values;

/**
 * One rule a profile works under: its number and its text.
 */
final readonly class ProfileRule
{
    public function __construct(
        public int $number,
        public string $text,
    ) {}
}
