<?php

declare(strict_types=1);

namespace App\Values;

use App\Exceptions\ExecutionBudgetInvalid;
use App\Hosts\Protocol\Data\HostContainerBudgetsData;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\LaravelData\Support\Transformation\TransformationContextFactory;

/**
 * The resources one start may use: every limit above zero, memory and swap equal, and none above
 * the host's maxima for one helper.
 */
#[MapName(SnakeCaseMapper::class)]
final class ExecutionBudgets extends Data
{
    private const int GIB = 1024 * 1024 * 1024;

    private const int MIB = 1024 * 1024;

    public const int MOST_CPU_CORES = 8;

    public const int MOST_MEMORY_BYTES = 16 * self::GIB;

    public const int MOST_PROCESSES = 1024;

    public const int MOST_WORKSPACE_BYTES = 50 * self::GIB;

    public const int DEFAULT_HOME_BYTES = 64 * self::MIB;

    /**
     * @throws ExecutionBudgetInvalid
     */
    public function __construct(
        public readonly int $cpuCores,
        public readonly int $memoryBytes,
        public readonly int $memorySwapBytes,
        public readonly int $processes,
        public readonly int $openFiles,
        public readonly int $tmpBytes,
        public readonly int $homeBytes,
        public readonly int $workspaceBytes,
        public readonly int $wallSeconds,
    ) {
        foreach (compact(
            'cpuCores',
            'memoryBytes',
            'processes',
            'openFiles',
            'tmpBytes',
            'homeBytes',
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
            'cpuCores' => [
                $cpuCores,
                self::MOST_CPU_CORES,
            ],
            'memoryBytes' => [
                $memoryBytes,
                self::MOST_MEMORY_BYTES,
            ],
            'processes' => [
                $processes,
                self::MOST_PROCESSES,
            ],
            'workspaceBytes' => [
                $workspaceBytes,
                self::MOST_WORKSPACE_BYTES,
            ],
        ] as $name => [$budgetAmount, $most]) {
            if ($budgetAmount > $most) {
                throw ExecutionBudgetInvalid::aboveHost($name, $budgetAmount, $most);
            }
        }
    }

    /**
     * The budgets the host enforces; the wall time is not one of them, as the journal ends a session at its
     * deadline itself.
     */
    public function hostBudgets(): HostContainerBudgetsData
    {
        $byPropertyName = TransformationContextFactory::create()->withoutPropertyNameMapping();

        return HostContainerBudgetsData::from($this->except('wallSeconds')->transform($byPropertyName));
    }

    /**
     * The main agent's budget in its container, larger than a helper's: 4 cores, 8 GiB memory and swap, 512
     * processes, 4,096 files, a 1 GiB tmp, a 256 MiB home, a 20 GiB workspace and twelve hours.
     */
    public static function mainAgent(): self
    {
        return new self(
            4,
            8 * self::GIB,
            8 * self::GIB,
            512,
            4096,
            self::GIB,
            256 * self::MIB,
            20 * self::GIB,
            12 * 3600,
        );
    }

    /**
     * The per-start defaults: 2 cores, 4 GiB memory and swap, 256 processes, 1,024 files, 256 MiB tmp, a 64 MiB home,
     * a 10 GiB workspace and six hours.
     */
    public static function defaults(): self
    {
        return new self(
            2,
            4 * self::GIB,
            4 * self::GIB,
            256,
            1024,
            256 * self::MIB,
            self::DEFAULT_HOME_BYTES,
            10 * self::GIB,
            6 * 3600,
        );
    }
}
