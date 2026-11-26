<?php

declare(strict_types=1);

namespace App\Events\Asks;

use App\Asks\Contracts\AskHopEvent;

/**
 * The holder of one step of an ask answered it.
 */
final readonly class AskHopAnswered implements AskEvent, AskHopEvent
{
    public function __construct(public string $askId, public string $hopId) {}
}
