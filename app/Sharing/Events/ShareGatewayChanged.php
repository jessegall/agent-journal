<?php

declare(strict_types=1);

namespace App\Sharing\Events;

use App\Contracts\Event;
use App\Ui\Contracts\UserInterfaceUpdater;
use DateTimeImmutable;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * The owner configured a gateway revision or disabled one. Raised after the transaction committed; it carries the
 * configuration, its version and whether it is now disabled, never a setting or secret. The owner's open sharing pages
 * reread on it.
 */
final readonly class ShareGatewayChanged implements Event, ShouldDispatchAfterCommit, UserInterfaceUpdater
{
    public function __construct(
        public string $configurationId,
        public int $configurationVersion,
        public bool $isDisabled,
        public DateTimeImmutable $occurredAt,
    ) {}
}
