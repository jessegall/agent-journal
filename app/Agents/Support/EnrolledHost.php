<?php

declare(strict_types=1);

namespace App\Agents\Support;

/**
 * A host just enrolled: its id and its secret, which is shown this once and stored only as a hash.
 */
final readonly class EnrolledHost
{
    public function __construct(
        public string $hostId,
        public string $secret,
    ) {}
}
