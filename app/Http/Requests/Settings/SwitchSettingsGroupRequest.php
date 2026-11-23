<?php

declare(strict_types=1);

namespace App\Http\Requests\Settings;

/**
 * A settings group switched on or off from the settings page, with whether it is now on.
 */
final class SwitchSettingsGroupRequest extends SettingsGroupRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [...parent::rules(), 'enabled' => ['required', 'boolean']];
    }

    public function isOn(): bool
    {
        return $this->boolean('enabled');
    }
}
