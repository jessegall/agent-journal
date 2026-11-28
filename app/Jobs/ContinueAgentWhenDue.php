<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Agents\Drivers\Work\RequestRetries;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;

final class ContinueAgentWhenDue implements ShouldQueue
{
    use Queueable;

    public function __construct(public readonly string $requestId) {}

    public function handle(RequestRetries $retries): void
    {
        $retries->continueWhenDue($this->requestId);
    }
}
