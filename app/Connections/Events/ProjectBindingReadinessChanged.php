<?php

declare(strict_types=1);

namespace App\Connections\Events;

use App\Connections\Enums\BindingReadiness;
use App\Contracts\Event;
use App\Ui\Contracts\UserInterfaceUpdater;
use DateTimeImmutable;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A binding's relay reported and the binding's readiness changed, such as from pending to ready; the owner's
 * Connect a project window rereads on it.
 */
final readonly class ProjectBindingReadinessChanged implements Event, ShouldDispatchAfterCommit, UserInterfaceUpdater
{
    public function __construct(
        public string $bindingId,
        public BindingReadiness $readiness,
        public DateTimeImmutable $occurredAt,
    ) {}
}
