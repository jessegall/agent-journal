<?php

declare(strict_types=1);

namespace App\Http\Requests\Hooks;

use App\Hooks\Enums\StopResultType;
use App\Hooks\Values\StopResultReport;
use App\Http\Data\Hooks\StopResultData;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * An authenticated host's results for one stop attempt: the policy digest and workspace generation it ran under and
 * one result per condition, with a summary of at most 2 KiB.
 */
final class StopResultsRequest extends FormRequest
{
    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'policy_digest' => ['required', 'string', 'size:64'],
            'workspace_generation' => ['required', 'integer', 'min:0'],
            'results' => ['required', 'array', 'min:1', 'max:50'],
            'results.*.condition_key' => ['required', 'string', 'max:64'],
            'results.*.definition_hash' => ['required', 'string', 'size:64'],
            'results.*.status' => ['required', Rule::enum(StopResultType::class)],
            'results.*.started_at' => ['required', 'date'],
            'results.*.ended_at' => ['nullable', 'date'],
            'results.*.exit_code' => ['nullable', 'integer'],
            'results.*.signal' => ['nullable', 'string', 'max:16'],
            'results.*.summary' => ['present', 'string', 'max:'.StopResultReport::SUMMARY_BYTES],
            'results.*.output' => ['nullable', 'string', 'max:65536'],
            'results.*.truncated' => ['required', 'boolean'],
        ];
    }

    public function attemptId(): string
    {
        return (string) $this->route('attempt');
    }

    public function policyDigest(): string
    {
        return $this->string('policy_digest')->toString();
    }

    public function workspaceGeneration(): int
    {
        return $this->integer('workspace_generation');
    }

    /**
     * @return list<StopResultReport>
     */
    public function results(): array
    {
        $stopReports = StopResultData::collect($this->validated('results'), 'array');

        return array_values(array_map(fn (StopResultData $stepOutput) => $stepOutput->report(), $stopReports));
    }
}
