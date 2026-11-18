<?php

declare(strict_types=1);

namespace App\Communication\Events;

use App\Contracts\Event;
use App\Ui\Contracts\UpdatesUserInterface;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A message was dismissed without an answer; raised once that has committed.
 */
final readonly class MessageDismissed implements Event, ShouldDispatchAfterCommit, UpdatesUserInterface
{
    public function __construct(public string $messageId) {}
}
