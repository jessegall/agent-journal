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
            'page' => ['nullable', 'integer', 'min:1'],
            'usage_page' => ['nullable', 'integer', 'min:1'],
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

    public function page(): int
    {
        return max(1, $this->integer('page', 1));
    }

    public function usagePage(): int
    {
        return max(1, $this->integer('usage_page', 1));
    }
}
