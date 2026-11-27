<?php

declare(strict_types=1);

namespace App\Http\Requests\Profiles;

use Illuminate\Foundation\Http\FormRequest;

/**
 * The host runner's list of the sign-ins it still runs.
 */
final class SignInReconcileRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'running' => [
                'present',
                'array',
            ],
            'running.*' => [
                'string',
                'max:64',
            ],
        ];
    }

    /**
     * @return list<string>
     */
    public function runningAttemptIds(): array
    {
        return array_values(array_map(strval(...), $this->array('running')));
    }
}
