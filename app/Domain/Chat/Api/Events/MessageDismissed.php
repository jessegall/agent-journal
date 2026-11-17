<?php

declare(strict_types=1);

namespace App\Domain\Chat\Api\Events;

use App\Domain\Contracts\ChangesWhatUsersSee;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A message was dismissed without an answer; raised once that has committed.
 */
final readonly class MessageDismissed implements ChangesWhatUsersSee, ShouldDispatchAfterCommit
{
    public function __construct(public int $messageId) {}
}
