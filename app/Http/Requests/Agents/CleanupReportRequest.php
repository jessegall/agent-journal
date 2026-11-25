<?php

declare(strict_types=1);

namespace App\Http\Requests\Agents;

use App\Enums\Sessions\CleanupStep;
use App\Values\CleanupReport;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * An authenticated host's pass over one ended start's cleanup: the resources it removed or found gone, the dirty
 * workspace it kept, and why a deletion failed.
 */
final class CleanupReportRequest extends FormRequest
{
    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'removed' => ['present', 'array', 'max:3'],
            'removed.*' => [Rule::enum(CleanupStep::class)],
            'kept_workspace' => ['sometimes', 'required', 'string', 'max:1024'],
            'failure' => ['sometimes', 'required', 'string', 'max:2000'],
        ];
    }

    public function sessionId(): string
    {
        return (string) $this->route('session');
    }

    public function report(): CleanupReport
    {
        return new CleanupReport(
            array_map(CleanupStep::from(...), array_values(array_map(strval(...), (array) $this->input('removed')))),
            $this->string('kept_workspace')->toString() ?: null,
            $this->string('failure')->toString() ?: null,
        );
    }
}
