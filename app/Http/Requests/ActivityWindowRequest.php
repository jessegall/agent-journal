<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * An Activity window's own query: the entry it read back to last, so the next page holds the entries before it; none
 * for the newest page.
 */
final class ActivityWindowRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return ['before' => [
            'nullable',
            'string',
            'ulid',
        ]];
    }

    public function before(): string
    {
        return $this->string('before')->toString();
    }
}
