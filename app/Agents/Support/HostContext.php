<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\AgentRequests\Support\SignedCall;

/**
 * The host behind the current request and its verified call, bound for this request only.
 */
final readonly class HostContext
{
    public function __construct(
        public string $hostId,
        public SignedCall $call,
    ) {}
}
