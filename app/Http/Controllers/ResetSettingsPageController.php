<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Commands\ResetSetting\ResetSettingCommand;
use App\Contracts\CommandBus;
use App\Contracts\SettingsCatalogue;
use App\Data\SettingData;
use App\Enums\SettingSource;
use App\Http\Requests\Settings\SaveSettingsRequest;
use App\Http\Responses\PageActionAnswers;
use App\Values\SettingReference;
use Illuminate\Http\RedirectResponse;

/**
 * Takes every changed setting of an owner back to its default, one reset each against the revision the page read, the
 * next against the revision the last made; an owner changed meanwhile is refused with its current revision.
 */
final readonly class ResetSettingsPageController
{
    public function __invoke(
        SaveSettingsRequest $request,
        SettingsCatalogue $catalogue,
        CommandBus $commands,
        PageActionAnswers $answers,
    ): RedirectResponse {
        $revision = $request->expectedRevision();

        foreach ($catalogue->owner($request->owner())->groups as $group) {
            foreach ($group->settings as $setting) {
                if ($this->isChanged($setting)) {
                    $reference = new SettingReference($setting->identity->owner, $setting->identity->key);
                    $revision = $commands->run(new ResetSettingCommand($reference, $revision))->revision;
                }
            }
        }

        return $answers->backWithNotice('Settings reset to their defaults');
    }

    private function isChanged(SettingData $setting): bool
    {
        return $setting->source === SettingSource::Override;
    }
}
