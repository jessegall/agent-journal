<?php

declare(strict_types=1);

namespace App\Agents\Stored;

use App\Agents\Support\ExecutionBudgets;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * The execution budgets of a start as the JSON column holds them.
 */
#[MapName(SnakeCaseMapper::class)]
final class StoredExecutionBudgets extends Data
{
    public function __construct(
        public readonly int $cpuCores,
        public readonly int $memoryBytes,
        public readonly int $memorySwapBytes,
        public readonly int $processes,
        public readonly int $openFiles,
        public readonly int $tmpBytes,
        public readonly int $workspaceBytes,
        public readonly int $wallSeconds,
        public readonly int $homeBytes = ExecutionBudgets::DEFAULT_HOME_BYTES,
    ) {}

    public static function fromExecutionBudgets(ExecutionBudgets $budgets): self
    {
        return self::from([
            'cpu_cores' => $budgets->cpuCores,
            'memory_bytes' => $budgets->memoryBytes,
            'memory_swap_bytes' => $budgets->memorySwapBytes,
            'processes' => $budgets->processes,
            'open_files' => $budgets->openFiles,
            'tmp_bytes' => $budgets->tmpBytes,
            'home_bytes' => $budgets->homeBytes,
            'workspace_bytes' => $budgets->workspaceBytes,
            'wall_seconds' => $budgets->wallSeconds,
        ]);
    }

    public function toExecutionBudgets(): ExecutionBudgets
    {
        return ExecutionBudgets::make(
            $this->cpuCores,
            $this->memoryBytes,
            $this->memorySwapBytes,
            $this->processes,
            $this->openFiles,
            $this->tmpBytes,
            $this->homeBytes,
            $this->workspaceBytes,
            $this->wallSeconds,
        );
    }
}
