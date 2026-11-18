<?php

declare(strict_types=1);

namespace App\Http\Requests\Processes;

use Illuminate\Foundation\Http\FormRequest;

/**
 * The request id an agent uses an evidence permit under; the same id again returns the same run.
 */
final class StartEvidenceRunRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return ['request_id' => ['required', 'string', 'max:64']];
    }

    public function requestId(): string
    {
        return $this->string('request_id')->toString();
    }
}
