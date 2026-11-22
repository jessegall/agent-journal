<?php

declare(strict_types=1);

namespace App\Support;

/**
 * The operation an agent's status follows: its id, what it is, the stage it stands at and the version a recovery
 * must name.
 */
final readonly class StatusOperation
{
    public function __construct(
        public string $id,
        public string $type,
        public string $stage,
        public int $version,
    ) {}
}
