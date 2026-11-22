<?php

declare(strict_types=1);

namespace App\Communication\Enums;

/**
 * Where one attempt to present chat text to an agent's driver stands: sent and waiting, confirmed by the driver,
 * expired without word, or failed.
 */
enum PresentationBatchState: string
{
    case Dispatched = 'dispatched';
    case Confirmed = 'confirmed';
    case Expired = 'expired';
    case Failed = 'failed';

    public function isSettled(): bool
    {
        return $this !== self::Dispatched;
    }
}
