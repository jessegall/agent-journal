<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Sessions\ClosingWordsEvent;

/**
 * An agent stopped with closing words and was asked whether the user should see them.
 */
final readonly class ClosingWordsOffered implements ClosingWordsEvent, SessionEvent
{
    public function __construct(public string $turnId) {}
}
