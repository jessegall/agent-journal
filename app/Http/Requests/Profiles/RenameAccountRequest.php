<?php

declare(strict_types=1);

namespace App\Http\Requests\Profiles;

use App\Values\AccountLabel;
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
        return [
            'label' => ['required', 'string', 'max:'.AccountLabel::LENGTH_LIMIT],
            'seenRevision' => ['nullable', 'integer', 'min:0'],
        ];
    }

    /**
     * The field is the account's name on screen, so a refusal names it that way.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return ['label' => 'name'];
    }

    public function accountId(): string
    {
        return (string) $this->route('account');
    }

    /**
     * The name revision the page showed, so a name renamed meanwhile is not overwritten unseen.
     */
    public function seenRevision(): int|null
    {
        return $this->filled('seenRevision') ? $this->integer('seenRevision') : null;
    }

    public function label(): string
    {
        return $this->string('label')->toString();
    }
}
