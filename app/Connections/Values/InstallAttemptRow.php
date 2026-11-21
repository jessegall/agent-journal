<?php

declare(strict_types=1);

namespace App\Connections\Values;

/**
 * One install attempt as the owner's list shows it: its public reference, its target (a new project, or the project
 * and environment it joins, by label), where it stands, its version, when it was made, in ISO 8601, and the binding
 * a spent one made. Never a ticket.
 */
final readonly class InstallAttemptRow
{
    public function __construct(
        public string $reference,
        public string $mode,
        public string $target,
        public string $state,
        public int $version,
        public string $createdAt,
        public string|null $bindingId,
    ) {}
}
