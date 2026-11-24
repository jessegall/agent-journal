<?php

declare(strict_types=1);

namespace Domain\Helpers\Events;

/**
 * A helper notice was delivered to its agent.
 */
final readonly class HelperNoticeDelivered extends HelperEvent
{
    public function __construct(
        public string $noticeId,
    ) {}
}
