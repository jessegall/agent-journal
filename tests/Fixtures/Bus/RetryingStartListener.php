<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus;

use App\Bus\Attributes\RetriedWhenItFails;
use App\Contracts\Events\Listener;
use App\Events\Sessions\AgentRuntimeStartProven;
use RuntimeException;

#[RetriedWhenItFails]
final class RetryingStartListener implements Listener
{
    private int $calls = 0;

    /** @var list<string> */
    public array $heard = [];

    public function handle(AgentRuntimeStartProven $event): void
    {
        if ($this->calls++ === 0) {
            throw new RuntimeException('The listener could not continue the start.');
        }

        $this->heard[] = $event->runtimeId;
    }
}
