<?php

declare(strict_types=1);

namespace App\Settings\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Settings\SaveSettingsRequest;
use App\Settings\Commands\SetBooleanSetting;
use App\Settings\Commands\SetIntegerSetting;
use App\Settings\Commands\SetStringChoice;
use App\Settings\Commands\SetStringSetting;
use App\Settings\Contracts\SettingsCatalogue;
use App\Settings\Data\SettingData;
use App\Settings\Data\SettingGroupData;
use App\Settings\Data\StringChoiceValueData;
use App\Settings\Enums\SettingType;
use App\Settings\Support\SettingsValues;
use App\Settings\Values\SettingReference;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Saves the values changed on the settings page, one command each against the revision the page read, the next
 * command against the revision the last one made; a value the setting already holds is not sent.
 */
final readonly class SaveSettingsPageController
{
    public function __invoke(
        SaveSettingsRequest $request,
        SettingsCatalogue $catalogue,
        CommandBus $commands,
        Redirector $redirect,
    ): RedirectResponse {
        $revision = $request->expectedRevision();
        $sent = $request->values();

        foreach ($catalogue->owner($request->owner())->groups as $group) {
            foreach ($this->settingsOf($group) as $setting) {
                $key = $setting->identity->key;

                if (! array_key_exists($key, $sent) || $sent[$key] === SettingsValues::textOf($setting)) {
                    continue;
                }

                $command = $this->commandFor($setting, $sent[$key], $revision);

                if ($command !== null) {
                    $revision = $commands->run($command)->revision;
                }
            }
        }

        return $redirect->back(303);
    }

    /**
     * @return list<SettingData>
     */
    private function settingsOf(SettingGroupData $group): array
    {
        return array_values(array_filter($group->settings, SettingsValues::isEditable(...)));
    }

    private function commandFor(SettingData $setting, string $text, int $revision): object|null
    {
        $reference = new SettingReference($setting->identity->owner, $setting->identity->key);

        return match (true) {
            $setting->default instanceof StringChoiceValueData => new SetStringChoice($reference, $text, $revision),
            $setting->type === SettingType::Boolean => new SetBooleanSetting($reference, $text === '1', $revision),
            $setting->type === SettingType::Integer => new SetIntegerSetting($reference, (int) $text, $revision),
            $setting->type === SettingType::String => new SetStringSetting($reference, $text, $revision),
            default => null,
        };
    }
}
