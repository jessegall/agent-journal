<?php

declare(strict_types=1);

namespace App\Events\Sessions;

/**
 * An agent stopped with closing words and was asked whether the user should see them.
 */
final readonly class ClosingWordsOffered extends SessionEvent
{
    public function __construct(public string $turnId) {}
}
