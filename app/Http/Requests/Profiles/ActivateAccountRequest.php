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
        return ['expectedChangeNumber' => ['nullable', 'integer', 'min:0']];
    }

    /**
     * The selection's change number the page showed, when the page sent one.
     */
    public function expectedChangeNumber(): int|null
    {
        return $this->filled('expectedChangeNumber') ? $this->integer('expectedChangeNumber') : null;
    }

    public function accountId(): string
    {
        return (string) $this->route('account');
    }
}
