<?php

declare(strict_types=1);

namespace Tests\Support\Assertions\Facts;

use App\Hosts\ProcessFeed;
use App\Models\Hosts\HostOrder;
use App\Models\Hosts\HostProcess;
use Tests\Support\Assertions\Contracts\Facts;

/**
 * A host process as a test asserts it: its purpose, status, generation, its driver worker's generation and exit code,
 * the rows of its newest screen and how long it held still, and the orders the journal made for it, by type too.
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
            'workerGeneration' => $process->worker_generation,
            'exitCode' => $process->exit_code,
            'outputOffset' => $process->output_offset,
            'executionIdentity' => $process->execution_identity,
            'rows' => fn () => $this->feed->latestFrame($this->processId)?->rows,
            'stillMs' => function () {
                $frame = $this->feed->latestFrame($this->processId);

                return $frame === null ? null : min($frame->unchangedMs);
            },
            'orderCounts' => fn () => array_count_values(array_map(
                fn (HostOrder $order) => $order->type->value,
                HostOrder::findForProcess($this->processId),
            )),
            'orders' => fn () => array_map(
                fn (HostOrder $order) => new HostOrderFacts($order),
                HostOrder::findForProcess($this->processId),
            ),
        ];
    }
}
