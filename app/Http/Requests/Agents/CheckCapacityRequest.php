<?php

declare(strict_types=1);

namespace App\Http\Requests\Agents;

use App\Enums\Agents\ExecutionModeType;
use App\Values\ExecutionBudgets;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * The start choices a capacity check reads: the placement and the CPU, memory and disk the start asks for; a budget
 * left out is the default a start would get.
 */
final class CheckCapacityRequest extends FormRequest
{
    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'mode' => ['required', Rule::enum(ExecutionModeType::class)],
            'cpuCores' => ['nullable', 'integer', 'min:1'],
            'memoryBytes' => ['nullable', 'integer', 'min:1'],
            'diskBytes' => ['nullable', 'integer', 'min:1'],
        ];
    }

    public function mode(): ExecutionModeType
    {
        return ExecutionModeType::from($this->string('mode')->toString());
    }

    public function budgets(): ExecutionBudgets
    {
        $defaults = ExecutionBudgets::defaults();
        $memory = $this->integer('memoryBytes', $defaults->memoryBytes);

        return new ExecutionBudgets(
            $this->integer('cpuCores', $defaults->cpuCores),
            $memory,
            $memory,
            $defaults->processes,
            $defaults->openFiles,
            $defaults->tmpBytes,
            $defaults->homeBytes,
            $this->integer('diskBytes', $defaults->workspaceBytes),
            $defaults->wallSeconds,
        );
    }
}
