<?php

declare(strict_types=1);

namespace App\Http\Requests\Profiles;

use Illuminate\Foundation\Http\FormRequest;

/**
 * The challenge the host's program printed: the https address the user opens and, for a device sign-in, its code.
 */
final class SignInChallengeRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'address' => ['required', 'string', 'max:2000', 'starts_with:https://'],
            'code' => ['nullable', 'string', 'max:64'],
        ];
    }

    public function attemptId(): string
    {
        return (string) $this->route('attempt');
    }

    public function address(): string
    {
        return $this->string('address')->toString();
    }

    public function code(): string|null
    {
        return $this->filled('code') ? $this->string('code')->toString() : null;
    }
}
