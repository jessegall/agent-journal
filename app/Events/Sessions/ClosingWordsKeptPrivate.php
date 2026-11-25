<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Sessions\ClosingWordsEvent;

/**
 * An agent stopped again with the same closing words, so they stay private.
 */
final readonly class ClosingWordsKeptPrivate extends SessionEvent implements ClosingWordsEvent
{
    public function __construct(public string $turnId) {}
}
