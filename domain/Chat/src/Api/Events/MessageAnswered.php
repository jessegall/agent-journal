<?php

declare(strict_types=1);

namespace Domain\Chat\Api\Events;

use App\Ui\Contracts\UpdatesUserInterface;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A message was answered; raised once that has committed.
 */
final readonly class MessageAnswered implements ShouldDispatchAfterCommit, UpdatesUserInterface
{
    public function __construct(public int $messageId) {}
}
