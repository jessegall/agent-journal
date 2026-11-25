<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Contracts\Connections\ProjectBindingEvent;
use App\Contracts\Navigation\UserInterfaceUpdater;
use App\Enums\Connections\BindingReadiness;
use DateTimeImmutable;

/**
 * A binding's relay reported and the binding's readiness changed, such as from pending to ready; the owner's
 * Connect a project window rereads on it.
 */
final readonly class ProjectBindingReadinessChanged extends ConnectionEvent implements ProjectBindingEvent, UserInterfaceUpdater
{
    public function __construct(
        public string $bindingId,
        public BindingReadiness $readiness,
        public DateTimeImmutable $occurredAt,
    ) {}
}
