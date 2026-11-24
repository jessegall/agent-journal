<?php

declare(strict_types=1);

namespace App\Events\Sessions;

/**
 * An agent stopped again with the same closing words, so they stay private.
 */
final readonly class ClosingWordsKeptPrivate extends SessionEvent
{
    public function __construct(public string $turnId) {}
}
