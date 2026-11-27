<?php

declare(strict_types=1);

namespace Tests\Fixtures\Architecture\Statuses;

use App\Hosts\Enums\HostInstructionStatus;

/**
 * A value that holds a status under the name state, which the architecture test refuses.
 */
final readonly class StatusNamedState
{
    public function __construct(public HostInstructionStatus $state) {}
}
