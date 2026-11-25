<?php

declare(strict_types=1);

namespace App\Events\Asks;

use App\Contracts\Asks\AskHopEvent;

/**
 * One step of an ask kept how its holder was woken.
 */
final readonly class AskHopWakeRecorded implements AskEvent, AskHopEvent
{
    public function __construct(public string $askId, public string $hopId, public string $wake) {}
}
