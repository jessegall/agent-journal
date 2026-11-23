<?php

declare(strict_types=1);

namespace App\Http\Requests\Settings;

use Illuminate\Foundation\Http\FormRequest;

/**
 * One group's settings sent from the settings page: the owner, the group, the revision they were read at, and each
 * setting's new value by its key.
 */
final class SaveSettingsRequest extends FormRequest
{
    private const array RESERVED = ['owner', 'group', 'revision'];

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'owner' => ['required', 'string', 'max:64'],
            'revision' => ['required', 'integer', 'min:0'],
        ];
    }

    public function owner(): string
    {
        return $this->string('owner')->toString();
    }

    public function expectedRevision(): int
    {
        return $this->integer('revision');
    }

    /**
     * The new values by setting key, as text.
     *
     * @return array<string, string>
     */
    public function values(): array
    {
        return array_map(strval(...), array_diff_key($this->except(self::RESERVED), ['_token' => true]));
    }
}
