<?php

declare(strict_types=1);

namespace App\Domain\Chat\Api\Events;

use App\Core\Hooks\Support\StackTarget;
use App\Core\Ui\Contracts\ChangesWhatUsersSee;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A user sent a message to an agent's session; raised once the send has committed.
 */
final readonly class MessageSent implements ChangesWhatUsersSee, ShouldDispatchAfterCommit
{
    public function __construct(
        public int $messageId,
        public StackTarget $target,
    ) {}
}
