<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Commands\Settings\SetBooleanSetting\SetBooleanSettingCommand;
use App\Commands\Settings\SetIntegerSetting\SetIntegerSettingCommand;
use App\Commands\Settings\SetStringChoice\SetStringChoiceCommand;
use App\Commands\Settings\SetStringSetting\SetStringSettingCommand;
use App\Contracts\Bus\Command;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Settings\SettingsCatalogue;
use App\Data\Settings\SettingData;
use App\Data\Settings\SettingGroupData;
use App\Data\Settings\StringChoiceValueData;
use App\Enums\Settings\SettingType;
use App\Http\Requests\Settings\SaveSettingsRequest;
use App\Http\Responses\PageActionAnswers;
use App\Support\SettingsValues;
use App\Values\SettingReference;
use App\Values\SettingsChange;
use Illuminate\Http\RedirectResponse;

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
        PageActionAnswers $answers,
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

        return $answers->back();
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
            $setting->default instanceof StringChoiceValueData => new SetStringChoiceCommand(
                $reference,
                $text,
                $revision,
            ),
            $setting->type === SettingType::Boolean => new SetBooleanSettingCommand(
                $reference,
                $text === '1',
                $revision,
            ),
            $setting->type === SettingType::Integer => new SetIntegerSettingCommand($reference, (int) $text, $revision),
            $setting->type === SettingType::String => new SetStringSettingCommand($reference, $text, $revision),
            default => null,
        };
    }
}
