<?php

declare(strict_types=1);

namespace App\Connections\Events;

use App\Contracts\Event;
use DateTimeImmutable;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A binding was revoked: its authority generation rose, so every credential of the one before it is refused.
 */
final readonly class ProjectBindingRevoked implements Event, ShouldDispatchAfterCommit
{
    public function __construct(
        public string $bindingId,
        public int $authorityGeneration,
        public DateTimeImmutable $occurredAt,
    ) {}
}
