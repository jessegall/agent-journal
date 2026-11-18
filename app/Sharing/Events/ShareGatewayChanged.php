<?php

declare(strict_types=1);

namespace App\Sharing\Events;

use App\Contracts\Event;
use DateTimeImmutable;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * The owner configured a gateway revision or disabled one. Raised after the transaction committed; it carries the
 * configuration, its version and whether it is now disabled, never a setting or secret.
 */
final readonly class ShareGatewayChanged implements Event, ShouldDispatchAfterCommit
{
    public function __construct(
        public string $configurationId,
        public int $configurationVersion,
        public bool $isDisabled,
        public DateTimeImmutable $occurredAt,
    ) {}
}
