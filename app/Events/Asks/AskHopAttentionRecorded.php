<?php

declare(strict_types=1);

namespace App\Events\Asks;

use App\Contracts\Asks\AskHopEvent;

/**
 * One step of an ask kept what came of asking its holder to look.
 */
final readonly class AskHopAttentionRecorded implements AskEvent, AskHopEvent
{
    public function __construct(public string $askId, public string $hopId, public string $attention) {}
}
