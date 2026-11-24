<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Where waking one recipient about one receipt stands: still trying, taken by its runtime, waiting for a recipient
 * that runs nowhere to start, given up after too many tries, or no longer wanted.
 */
enum ReceiptDeliveryState: string
{
    case Pending = 'pending';
    case Accepted = 'accepted';
    case Waiting = 'waiting';
    case Exhausted = 'exhausted';
    case Cancelled = 'cancelled';

    /**
     * The states of a delivery whose message has not reached its recipient; a cancelled one was dismissed and stays so.
     *
     * @return list<self>
     */
    public static function undelivered(): array
    {
        return [self::Pending, self::Waiting, self::Exhausted];
    }

    public function isPending(): bool
    {
        return $this === self::Pending;
    }

    public function wakeState(): WakeState
    {
        return match ($this) {
            self::Pending => WakeState::Pending,
            self::Accepted => WakeState::Accepted,
            self::Waiting => WakeState::WaitingForStartup,
            self::Exhausted => WakeState::Exhausted,
            self::Cancelled => WakeState::Cancelled,
        };
    }
}
