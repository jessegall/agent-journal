<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\GatewayOperationType;

/**
 * An operation a supervisor run claimed: whether to open or close, and the run, endpoint version, lease and
 * configuration it carries it out under.
 */
final readonly class ClaimedGatewayOperation
{
    public function __construct(
        public GatewayOperationType $type,
        public GatewayOperation $operation,
    ) {}
}
