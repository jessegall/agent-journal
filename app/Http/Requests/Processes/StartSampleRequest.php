<?php

declare(strict_types=1);

namespace App\Http\Requests\Processes;

use Illuminate\Foundation\Http\FormRequest;

/**
 * The permit a request's sample runs under and the request id that makes a retry the same run.
 */
final class StartSampleRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'permit' => ['required', 'string', 'max:64'],
            'request_id' => ['required', 'string', 'max:64'],
        ];
    }

    public function permit(): string
    {
        return $this->string('permit')->toString();
    }

    public function requestKey(): string
    {
        return $this->string('request_id')->toString();
    }
}
