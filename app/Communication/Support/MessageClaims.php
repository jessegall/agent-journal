<?php

declare(strict_types=1);

namespace App\Communication\Support;

use App\Assignments\Contracts\AssignmentStorage;
use App\Assignments\Contracts\ResponsibilityWriter;
use App\Communication\Models\Message;

/**
 * Ends whatever claim a message has once it no longer waits: answered or dismissed, nobody is taking it up.
 */
final readonly class MessageClaims
{
    public function __construct(
        private AssignmentStorage $store,
        private ResponsibilityWriter $responsibilities,
    ) {}

    public function releaseAny(Message $message): void
    {
        $claim = $this->store->lockCurrent($message->assignmentIdentity());

        if ($claim->isDefined()) {
            $this->responsibilities->release($message->assignmentIdentity(), $claim->get()->reference);
        }
    }
}
