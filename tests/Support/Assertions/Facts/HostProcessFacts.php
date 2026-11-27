<?php

declare(strict_types=1);

namespace Tests\Support\Assertions\Facts;

use App\Hosts\ProcessFeed;
use App\Models\Hosts\HostOrder;
use App\Models\Hosts\HostProcess;
use Tests\Support\Assertions\Contracts\Facts;

/**
 * A host process as a test asserts it: its purpose, status, generation and exit code, the rows of its newest screen
 * and the orders the journal made for it, read when asked.
 */
final readonly class HostProcessFacts implements Facts
{
    public function __construct(private string $processId, private ProcessFeed $feed) {}

    public function facts(): array
    {
        $process = HostProcess::query()->whereKey($this->processId)->sole();

        return [
            'purpose' => $process->purpose,
            'status' => $process->status,
            'generation' => $process->generation,
            'exitCode' => $process->exit_code,
            'rows' => fn () => $this->feed->latestFrame($this->processId)?->rows,
            'orders' => fn () => array_map(
                fn (HostOrder $order) => new HostOrderFacts($order),
                HostOrder::findForProcess($this->processId),
            ),
        ];
    }
}
