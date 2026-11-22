<?php

declare(strict_types=1);

namespace App\Communication\Enums;

/**
 * Where one agent's turn to speak on one user message stands: offered, claimed under a lease, spent on a
 * contribution, declined by the agent, or cancelled by the chat.
 */
enum SpeechOpportunityState: string
{
    case Offered = 'offered';
    case Claimed = 'claimed';
    case Spent = 'spent';
    case Declined = 'declined';
    case Cancelled = 'cancelled';

    public function isOpen(): bool
    {
        return $this === self::Offered || $this === self::Claimed;
    }
}
