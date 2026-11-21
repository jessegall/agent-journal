<?php

declare(strict_types=1);

namespace App\Http\Requests\Profiles;

use Illuminate\Foundation\Http\FormRequest;

/**
 * The owner's confirmed start of signing a saved account in again; the page's Idempotency-Key header names this
 * click, so a repeat answers the same attempt.
 */
final class SignInAgainRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [];
    }

    public function accountId(): string
    {
        return (string) $this->route('account');
    }
}
