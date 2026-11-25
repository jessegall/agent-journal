<?php

declare(strict_types=1);

namespace App\Events\Hooks;

use App\Support\RecordIdentity;

/**
 * The agent of this call assigned a helper a job about a record, a new helper started or one it sent more work, such
 * as a plan to review; the states of its own stack hear it.
 */
final readonly class HelperAssigned extends HookEvent
{
    public function __construct(
        public RecordIdentity $subject,
        public string $helperAgentId,
    ) {}
}
