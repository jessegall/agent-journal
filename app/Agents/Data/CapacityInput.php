<?php

declare(strict_types=1);

namespace App\Agents\Data;

use App\Agents\Enums\ExecutionModeType;
use App\Values\ExecutionBudgets;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The start choices a capacity check reads for an agent: the placement and the CPU, memory and disk the start asks
 * for; a budget left out is the default a start would get.
 */
#[TypeScript]
final class CapacityInput extends Data
{
    public function __construct(
        public readonly string $agent,
        public readonly ExecutionModeType $mode,
        public readonly int|null $cpuCores = null,
        public readonly int|null $memoryBytes = null,
        public readonly int|null $diskBytes = null,
    ) {}

    /**
     * @return array<string, list<string>>
     */
    public static function rules(): array
    {
        return [
            'agent' => [
                'required',
                'string',
                'max:64',
            ],
            'cpuCores' => [
                'nullable',
                'integer',
                'min:1',
            ],
            'memoryBytes' => [
                'nullable',
                'integer',
                'min:1',
            ],
            'diskBytes' => [
                'nullable',
                'integer',
                'min:1',
            ],
        ];
    }

    public function budgets(): ExecutionBudgets
    {
        $defaults = ExecutionBudgets::defaults();
        $memory = $this->memoryBytes ?? $defaults->memoryBytes;

        return ExecutionBudgets::from([
            'cpu_cores' => $this->cpuCores ?? $defaults->cpuCores,
            'memory_bytes' => $memory,
            'memory_swap_bytes' => $memory,
            'processes' => $defaults->processes,
            'open_files' => $defaults->openFiles,
            'tmp_bytes' => $defaults->tmpBytes,
            'home_bytes' => $defaults->homeBytes,
            'workspace_bytes' => $this->diskBytes ?? $defaults->workspaceBytes,
            'wall_seconds' => $defaults->wallSeconds,
        ]);
    }
}
