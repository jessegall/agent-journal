<?php

declare(strict_types=1);

namespace App\Hosts;

use App\Values\ClaimedRequest;

/**
 * The batch of requests one host claim hands out, in the order it took them from its runtimes.
 */
final readonly class ClaimedRequests
{
    /**
     * @param  list<ClaimedRequest>  $requests
     */
    public function __construct(public array $requests) {}

    public function isEmpty(): bool
    {
        return $this->requests === [];
    }
}
