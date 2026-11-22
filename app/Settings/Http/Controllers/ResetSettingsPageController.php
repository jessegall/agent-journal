<?php

declare(strict_types=1);

namespace App\Settings\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Settings\SaveSettingsRequest;
use App\Settings\Commands\ResetSetting\ResetSettingCommand;
use App\Settings\Contracts\SettingsCatalogue;
use App\Settings\Data\SettingData;
use App\Settings\Enums\SettingSource;
use App\Settings\Values\SettingReference;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

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
        Redirector $redirect,
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

        return $redirect->back(303);
    }

    private function isChanged(SettingData $setting): bool
    {
        return $setting->source === SettingSource::Override;
    }
}
