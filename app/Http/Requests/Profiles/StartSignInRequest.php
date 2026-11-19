<?php

declare(strict_types=1);

namespace App\Http\Requests\Profiles;

use Illuminate\Foundation\Http\FormRequest;

/**
 * The owner starts signing in a new account of a program under a name, or an existing account again; the request key
 * lets a repeated click rejoin the same attempt. The account's own rules check the name.
 */
final class StartSignInRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'program' => ['required', 'string', 'max:64'],
            'request_key' => ['required', 'string', 'max:128'],
            'label' => ['nullable', 'string', 'max:200'],
            'account_id' => ['nullable', 'string', 'max:64'],
        ];
    }

    public function program(): string
    {
        return $this->string('program')->toString();
    }

    public function requestKey(): string
    {
        return $this->string('request_key')->toString();
    }

    public function label(): string|null
    {
        return $this->filled('label') ? $this->string('label')->toString() : null;
    }

    public function accountId(): string|null
    {
        return $this->filled('account_id') ? $this->string('account_id')->toString() : null;
    }
}
