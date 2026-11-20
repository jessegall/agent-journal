<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Exceptions\ExecutionBudgetInvalid;

/**
 * The resources one start may use (doc 14, section 62): every limit above zero, memory and swap equal, and none above
 * the host's maxima for one helper.
 */
final readonly class ExecutionBudgets
{
    private const int GIB = 1024 * 1024 * 1024;

    private const int MIB = 1024 * 1024;

    public const int MOST_CPU_CORES = 8;

    public const int MOST_MEMORY_BYTES = 16 * self::GIB;

    public const int MOST_PROCESSES = 1024;

    public const int MOST_WORKSPACE_BYTES = 50 * self::GIB;

    private function __construct(
        public int $cpuCores,
        public int $memoryBytes,
        public int $memorySwapBytes,
        public int $processes,
        public int $openFiles,
        public int $tmpBytes,
        public int $workspaceBytes,
        public int $wallSeconds,
    ) {}

    /**
     * @throws ExecutionBudgetInvalid
     */
    public static function make(
        int $cpuCores,
        int $memoryBytes,
        int $memorySwapBytes,
        int $processes,
        int $openFiles,
        int $tmpBytes,
        int $workspaceBytes,
        int $wallSeconds,
    ): self {
        foreach (compact(
            'cpuCores',
            'memoryBytes',
            'processes',
            'openFiles',
            'tmpBytes',
            'workspaceBytes',
            'wallSeconds',
        ) as $name => $budgetAmount) {
            if ($budgetAmount < 1) {
                throw ExecutionBudgetInvalid::notPositive($name, $budgetAmount);
            }
        }

        if ($memorySwapBytes !== $memoryBytes) {
            throw ExecutionBudgetInvalid::swapDiffers($memoryBytes, $memorySwapBytes);
        }

        foreach ([
            'cpuCores' => [$cpuCores, self::MOST_CPU_CORES],
            'memoryBytes' => [$memoryBytes, self::MOST_MEMORY_BYTES],
            'processes' => [$processes, self::MOST_PROCESSES],
            'workspaceBytes' => [$workspaceBytes, self::MOST_WORKSPACE_BYTES],
        ] as $name => [$budgetAmount, $most]) {
            if ($budgetAmount > $most) {
                throw ExecutionBudgetInvalid::aboveHost($name, $budgetAmount, $most);
            }
        }

        return new self(
            $cpuCores,
            $memoryBytes,
            $memorySwapBytes,
            $processes,
            $openFiles,
            $tmpBytes,
            $workspaceBytes,
            $wallSeconds,
        );
    }

    /**
     * The per-start defaults: 2 cores, 4 GiB memory and swap, 256 processes, 1,024 files, 256 MiB tmp, a 10 GiB
     * workspace and six hours.
     */
    public static function defaults(): self
    {
        return self::make(2, 4 * self::GIB, 4 * self::GIB, 256, 1024, 256 * self::MIB, 10 * self::GIB, 6 * 3600);
    }
}
