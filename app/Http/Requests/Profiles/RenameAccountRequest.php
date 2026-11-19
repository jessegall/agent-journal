<?php

declare(strict_types=1);

namespace App\Http\Requests\Profiles;

use Illuminate\Foundation\Http\FormRequest;

/**
 * The owner gives the account the route names a new name; the account's own rules check the name itself.
 */
final class RenameAccountRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return ['label' => ['required', 'string', 'max:200']];
    }

    public function accountId(): string
    {
        return (string) $this->route('account');
    }

    public function label(): string
    {
        return $this->string('label')->toString();
    }
}
