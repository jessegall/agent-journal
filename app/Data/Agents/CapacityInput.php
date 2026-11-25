<?php

declare(strict_types=1);

namespace App\Data\Agents;

use App\Enums\Agents\ExecutionModeType;
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
            'agent' => ['required', 'string', 'max:64'],
            'cpuCores' => ['nullable', 'integer', 'min:1'],
            'memoryBytes' => ['nullable', 'integer', 'min:1'],
            'diskBytes' => ['nullable', 'integer', 'min:1'],
        ];
    }

    public function budgets(): ExecutionBudgets
    {
        $defaults = ExecutionBudgets::defaults();
        $memory = $this->memoryBytes ?? $defaults->memoryBytes;

        return new ExecutionBudgets(
            $this->cpuCores ?? $defaults->cpuCores,
            $memory,
            $memory,
            $defaults->processes,
            $defaults->openFiles,
            $defaults->tmpBytes,
            $defaults->homeBytes,
            $this->diskBytes ?? $defaults->workspaceBytes,
            $defaults->wallSeconds,
        );
    }
}
