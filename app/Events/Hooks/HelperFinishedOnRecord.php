<?php

declare(strict_types=1);

namespace App\Events\Hooks;

use App\Support\RecordIdentity;

/**
 * A helper finished the work on a record its parent sent it on; the states of the parent's running stack hear it.
 */
final readonly class HelperFinishedOnRecord extends HookEvent
{
    public function __construct(
        public RecordIdentity $subject,
        public string $helperAgentId,
    ) {}
}
