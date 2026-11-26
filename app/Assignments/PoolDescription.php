<?php

declare(strict_types=1);

namespace App\Assignments;

use App\Assignments\Enums\PoolInputType;

/**
 * What a user reads about a pool: its label, a line of help, and what a reference to it must carry.
 */
final readonly class PoolDescription
{
    public function __construct(
        public string $label,
        public string $help,
        public PoolInputType $input,
    ) {}
}
