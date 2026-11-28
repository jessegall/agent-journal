<?php

declare(strict_types=1);

namespace App\Http\Requests\Assignments;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Which record type to list the pools of.
 */
final class AutoAssignmentPoolsRequest extends FormRequest
{
    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return ['assignableType' => [
            'required',
            'string',
            'max:100',
        ]];
    }

    public function assignableType(): string
    {
        return $this->string('assignableType')->toString();
    }
}
