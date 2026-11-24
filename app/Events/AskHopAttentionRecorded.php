<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Chat\AskHopEvent;

/**
 * One step of an ask kept what came of asking its holder to look.
 */
final readonly class AskHopAttentionRecorded extends AskEvent implements AskHopEvent
{
    public function __construct(public string $askId, public string $hopId, public string $attention) {}
}
