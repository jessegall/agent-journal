<?php

declare(strict_types=1);

namespace App\Support\Wire\Contracts;

use App\Support\Cards\DockCard;
use App\Support\Cards\DockIdentity;
use App\Support\Wire\EncodedCard;

/**
 * Writes a checked card as the wire envelope the browser renders, with the summary shown when the card is over budget.
 */
interface CardEncoder
{
    /**
     * The card as the frontend receives it, for the placement and source, with its safe summary.
     */
    public function encode(DockCard $card, string $placementId, DockIdentity $source, string $safeSummary): EncodedCard;
}
