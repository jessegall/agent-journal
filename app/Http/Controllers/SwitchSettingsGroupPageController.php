<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Settings\SwitchSettingsGroupRequest;
use App\Http\Responses\PageActionAnswers;
use App\Settings\Commands\DisableSettingGroup\DisableSettingGroupCommand;
use App\Settings\Commands\EnableSettingGroup\EnableSettingGroupCommand;
use App\Settings\Values\GroupReference;
use Illuminate\Http\RedirectResponse;

/**
 * Switches a settings group on or off from the settings page, against the revision the page read, so a group changed
 * meanwhile is refused instead of overwritten.
 */
final readonly class SwitchSettingsGroupPageController
{
    #[Dispatches(EnableSettingGroupCommand::class)]
    #[Dispatches(DisableSettingGroupCommand::class)]
    public function __invoke(
        SwitchSettingsGroupRequest $request,
        CommandBus $commands,
        PageActionAnswers $answers,
    ): RedirectResponse {
        $group = new GroupReference($request->owner(), $request->group());
        $revision = $request->expectedRevision();

        $commands->run(
            $request->isOn()
                ? new EnableSettingGroupCommand($group, $revision)
                : new DisableSettingGroupCommand($group, $revision),
        );

        return $answers->back();
    }
}
