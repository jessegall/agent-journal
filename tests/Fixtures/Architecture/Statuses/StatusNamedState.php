<?php

declare(strict_types=1);

namespace Tests\Fixtures\Architecture\Statuses;

use App\Enums\Hosts\HostOrderStatus;

/**
 * A value that holds a status under the name state, which the architecture test refuses.
 */
final readonly class StatusNamedState
{
    public function __construct(public HostOrderStatus $state) {}
}
