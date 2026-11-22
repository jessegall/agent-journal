<?php

declare(strict_types=1);

namespace App\Http\Requests\Profiles;

use Illuminate\Foundation\Http\FormRequest;

/**
 * The accounts page's query: the account chosen to read, or Add account to open the sign-in flow.
 */
final class AccountsPageRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'account' => ['nullable', 'string', 'max:26'],
            'add' => ['nullable', 'boolean'],
        ];
    }

    public function chosenAccount(): string
    {
        return $this->string('account')->toString();
    }

    public function isAdding(): bool
    {
        return $this->boolean('add');
    }
}
