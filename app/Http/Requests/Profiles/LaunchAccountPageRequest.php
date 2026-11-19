<?php

declare(strict_types=1);

namespace App\Http\Requests\Profiles;

use Illuminate\Foundation\Http\FormRequest;

/**
 * The launch whose account the owner opens.
 */
final class LaunchAccountPageRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [];
    }

    public function sessionId(): string
    {
        return (string) $this->route('session');
    }
}
