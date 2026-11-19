<?php

declare(strict_types=1);

namespace App\Http\Requests\Profiles;

use Illuminate\Foundation\Http\FormRequest;

/**
 * The owner's confirmed start of signing a saved account in again, under a key the page made for this click.
 */
final class SignInAgainRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return ['request_key' => ['required', 'string', 'max:128']];
    }

    public function accountId(): string
    {
        return (string) $this->route('account');
    }

    public function requestKey(): string
    {
        return $this->string('request_key')->toString();
    }
}
