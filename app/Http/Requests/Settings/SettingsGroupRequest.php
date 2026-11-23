<?php

declare(strict_types=1);

namespace App\Http\Requests\Settings;

use Illuminate\Foundation\Http\FormRequest;

/**
 * One settings group named from the settings page: its owner, its key and the revision the page read it at.
 */
class SettingsGroupRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'owner' => ['required', 'string', 'max:64'],
            'group' => ['required', 'string', 'max:64'],
            'revision' => ['required', 'integer', 'min:0'],
        ];
    }

    public function owner(): string
    {
        return $this->string('owner')->toString();
    }

    public function group(): string
    {
        return $this->string('group')->toString();
    }

    public function expectedRevision(): int
    {
        return $this->integer('revision');
    }
}
