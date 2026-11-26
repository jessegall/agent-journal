<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Settings\SettingsGroupRequest;
use App\Http\Responses\PageActionAnswers;
use App\Settings\Commands\ResetSetting\ResetSettingCommand;
use App\Settings\Contracts\SettingsCatalogue;
use App\Settings\Data\SettingData;
use App\Settings\Enums\SettingSource;
use App\Settings\Values\SettingReference;
use Illuminate\Http\RedirectResponse;

/**
 * Takes every changed setting of one group back to its default, one reset each against the revision the page read, the
 * next against the revision the last made; a group changed meanwhile is refused with its current revision.
 */
final readonly class ResetSettingsPageController
{
    #[Dispatches(ResetSettingCommand::class)]
    public function __invoke(
        SettingsGroupRequest $request,
        SettingsCatalogue $catalogue,
        CommandBus $commands,
        PageActionAnswers $answers,
    ): RedirectResponse {
        $revision = $request->expectedRevision();

        foreach ($catalogue->owner($request->owner())->groups as $group) {
            if ($group->identity->key !== $request->group()) {
                continue;
            }

            foreach ($group->settings as $setting) {
                if (! $this->isChanged($setting)) {
                    continue;
                }

                $reference = new SettingReference($setting->identity->owner, $setting->identity->key);
                $revision = $commands->run(new ResetSettingCommand($reference, $revision))->revision;
            }
        }

        return $answers->backWithNotice('Settings reset to their defaults');
    }

    private function isChanged(SettingData $setting): bool
    {
        return $setting->source === SettingSource::Override;
    }
}
