<?php

declare(strict_types=1);

namespace App\Settings\Commands\ResetSettingGroup;

use App\Bus\Contracts\CommandHandler;
use App\Settings\SettingsWriter;
use App\Settings\SettingTargets;
use App\Settings\Values\SettingsChange;

/**
 * Removes a group's stored switch after checking who asks and that the group can be switched, so it follows its
 * default.
 */
final readonly class ResetSettingGroupHandler implements CommandHandler
{
    public function __construct(private SettingTargets $targets, private SettingsWriter $writer) {}

    public function handle(ResetSettingGroupCommand $command): SettingsChange
    {

        return $this->writer->resetToggle($this->targets->toggleGroup($command->group), $command->expectedRevision);
    }
}
