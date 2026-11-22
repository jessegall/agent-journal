<?php

declare(strict_types=1);

namespace App\Http\Requests\Communication;

use Illuminate\Foundation\Http\FormRequest;

final class NotificationChangesRequest extends FormRequest
{
    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'since' => ['required', 'string', 'max:200'],
        ];
    }

    /**
     * The cursor a snapshot or an earlier page of changes gave.
     */
    public function since(): string
    {
        return $this->string('since')->toString();
    }
}
