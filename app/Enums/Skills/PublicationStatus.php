<?php

declare(strict_types=1);

namespace App\Enums\Skills;

/**
 * Where one publication of a session's skills stands. Pending waits for a worker, preparing is staged under a lease,
 * delivered is active at the target; failed can be retried; superseded and retired are final.
 */
enum PublicationStatus: string
{
    case Pending = 'pending';
    case Preparing = 'preparing';
    case Delivered = 'delivered';
    case Failed = 'failed';
    case Superseded = 'superseded';
    case Retired = 'retired';

    public function canMoveTo(self $next): bool
    {
        return in_array($next, match ($this) {
            self::Pending => [
                self::Preparing,
                self::Failed,
                self::Superseded,
            ],
            self::Preparing => [
                self::Preparing,
                self::Delivered,
                self::Failed,
                self::Superseded,
            ],
            self::Delivered => [
                self::Superseded,
                self::Retired,
            ],
            self::Failed => [
                self::Pending,
                self::Superseded,
                self::Retired,
            ],
            self::Superseded => [self::Retired],
            self::Retired => [],
        }, true);
    }

    /**
     * Whether the session still waits for it: open, or failed and waiting for a retry.
     */
    public function awaitsDelivery(): bool
    {
        return $this->isOpen() || $this === self::Failed;
    }

    /**
     * Whether a worker still has to deliver it.
     */
    public function isOpen(): bool
    {
        return $this === self::Pending || $this === self::Preparing;
    }
}
