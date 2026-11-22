<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Event;
use App\Contracts\UserInterfaceUpdater;
use App\Enums\BindingReadiness;
use DateTimeImmutable;

/**
 * A binding's relay reported and the binding's readiness changed, such as from pending to ready; the owner's
 * Connect a project window rereads on it.
 */
final readonly class ProjectBindingReadinessChanged implements Event, UserInterfaceUpdater
{
    public function __construct(
        public string $bindingId,
        public BindingReadiness $readiness,
        public DateTimeImmutable $occurredAt,
    ) {}
}
