<?php

declare(strict_types=1);

namespace App\Docking\Wire\Contracts;

use App\Docking\Cards\DockCard;
use App\Docking\Cards\DockIdentity;
use App\Docking\Wire\EncodedCard;

/**
 * Writes a checked card as the wire envelope the browser renders, with the summary shown when the card is over budget.
 */
interface CardEncoder
{
    public function encode(DockCard $card, string $placementId, DockIdentity $source, string $safeSummary): EncodedCard;
}
