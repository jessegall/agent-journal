<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Connections\Contracts\ProjectBindingEvent;
use DateTimeImmutable;

/**
 * A binding was revoked: its authority generation rose, so every credential of the one before it is refused.
 */
final readonly class ProjectBindingRevoked implements ConnectionEvent, ProjectBindingEvent
{
    public function __construct(
        public string $bindingId,
        public int $authorityGeneration,
        public DateTimeImmutable $occurredAt,
    ) {}
}
