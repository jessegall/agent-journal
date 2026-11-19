<?php

declare(strict_types=1);

namespace App\Http\Requests\Profiles;

use Illuminate\Foundation\Http\FormRequest;

/**
 * The owner chooses the account the route names for new starts of its program.
 */
final class ActivateAccountRequest extends FormRequest
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
