<?php

declare(strict_types=1);

namespace App\Events\Asks;

/**
 * The holder an ask moved up to took it.
 */
final readonly class AskAccepted implements AskEvent
{
    public function __construct(public string $askId) {}
}
