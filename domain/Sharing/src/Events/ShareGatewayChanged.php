<?php

declare(strict_types=1);

namespace Domain\Sharing\Events;

use App\Contracts\Navigation\UserInterfaceUpdater;
use DateTimeImmutable;
use Domain\Sharing\Contracts\ShareGatewayEvent;

/**
 * The owner configured a gateway revision or disabled one. Raised after the transaction committed; it carries the
 * configuration, its version and whether it is now disabled, never a setting or secret. The owner's open sharing pages
 * reread on it.
 */
final readonly class ShareGatewayChanged extends ShareEvent implements ShareGatewayEvent, UserInterfaceUpdater
{
    public function __construct(
        public string $configurationId,
        public int $configurationVersion,
        public bool $isDisabled,
        public DateTimeImmutable $occurredAt,
    ) {}
}
