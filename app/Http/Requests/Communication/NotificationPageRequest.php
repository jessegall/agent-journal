<?php

declare(strict_types=1);

namespace App\Http\Requests\Communication;

use Illuminate\Foundation\Http\FormRequest;

final class NotificationPageRequest extends FormRequest
{
    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'cursor' => ['nullable', 'string', 'max:200'],
        ];
    }

    /**
     * The cursor of the older page asked for; none asks for the newest page.
     */
    public function cursor(): string|null
    {
        return $this->filled('cursor') ? $this->string('cursor')->toString() : null;
    }
}
