<?php

declare(strict_types=1);

namespace App\Events;

use App\Support\RecordIdentity;

/**
 * The agent of this call started or sent a helper to work on a record, such as a plan to review; the states of its
 * own stack hear it.
 */
final readonly class HelperSentOnRecord extends HookEvent
{
    public function __construct(
        public RecordIdentity $subject,
        public string $helperAgentId,
    ) {}
}
