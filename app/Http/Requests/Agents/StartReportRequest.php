<?php

declare(strict_types=1);

namespace App\Http\Requests\Agents;

use App\Enums\Drivers\DriverFailure;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * An authenticated host's report about a process start: the session it claims a start for, the execution identity it
 * made, the checked failure it saw, or the start keys whose exit it proved.
 */
final class StartReportRequest extends FormRequest
{
    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'session_id' => ['sometimes', 'required', 'string', 'max:64'],
            'execution_id' => ['sometimes', 'required', 'string', 'max:128'],
            'failure' => ['sometimes', 'required', Rule::enum(DriverFailure::class)],
            'stopped' => ['sometimes', 'array', 'max:500'],
            'stopped.*' => ['string', 'max:64'],
        ];
    }

    public function startKey(): string
    {
        return (string) $this->route('start');
    }

    public function sessionId(): string
    {
        return $this->string('session_id')->toString();
    }

    public function executionId(): string
    {
        return $this->string('execution_id')->toString();
    }

    public function failure(): DriverFailure
    {
        return $this->enum('failure', DriverFailure::class) ?? DriverFailure::Unknown;
    }

    /**
     * @return list<string>
     */
    public function stoppedStartKeys(): array
    {
        return array_values(array_map(strval(...), (array) $this->input('stopped', [])));
    }
}
