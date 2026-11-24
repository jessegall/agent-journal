<?php

declare(strict_types=1);

namespace App\Events;

/**
 * An ask is to move up to the supervisor named.
 */
final readonly class AskEscalated extends AskEvent
{
    public function __construct(public string $askId, public string $target) {}
}
