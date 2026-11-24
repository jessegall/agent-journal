<?php

declare(strict_types=1);

namespace App\Events;

/**
 * The holder an ask moved up to took it.
 */
final readonly class AskAccepted extends AskEvent
{
    public function __construct(public string $askId) {}
}
