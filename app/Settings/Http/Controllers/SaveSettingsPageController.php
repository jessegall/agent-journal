<?php

declare(strict_types=1);

namespace App\Settings\Http\Controllers;

use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Settings\SaveSettingsRequest;
use App\Settings\Commands\SetBooleanSetting\SetBooleanSettingCommand;
use App\Settings\Commands\SetIntegerSetting\SetIntegerSettingCommand;
use App\Settings\Commands\SetStringChoice\SetStringChoiceCommand;
use App\Settings\Commands\SetStringSetting\SetStringSettingCommand;
use App\Settings\Contracts\SettingsCatalogue;
use App\Settings\Data\SettingData;
use App\Settings\Data\SettingGroupData;
use App\Settings\Data\StringChoiceValueData;
use App\Settings\Enums\SettingType;
use App\Settings\Support\SettingsValues;
use App\Settings\Values\SettingReference;
use App\Settings\Values\SettingsChange;
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

    /**
     * @return Command<SettingsChange>|null
     */
    private function commandFor(SettingData $setting, string $text, int $revision): Command|null
    {
        $reference = new SettingReference($setting->identity->owner, $setting->identity->key);

        return match (true) {
            $setting->default instanceof StringChoiceValueData => new SetStringChoiceCommand($reference, $text, $revision),
            $setting->type === SettingType::Boolean => new SetBooleanSettingCommand($reference, $text === '1', $revision),
            $setting->type === SettingType::Integer => new SetIntegerSettingCommand($reference, (int) $text, $revision),
            $setting->type === SettingType::String => new SetStringSettingCommand($reference, $text, $revision),
            default => null,
        };
    }
}
