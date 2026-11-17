<?php

declare(strict_types=1);

namespace App\Domain\Chat\Api\Events;

use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A message was answered; raised once that has committed.
 */
final readonly class MessageAnswered implements ShouldDispatchAfterCommit
{
    public function __construct(public int $messageId) {}
}
