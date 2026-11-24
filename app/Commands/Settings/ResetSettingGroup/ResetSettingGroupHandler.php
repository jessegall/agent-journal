<?php

declare(strict_types=1);

namespace App\Commands\Settings\ResetSettingGroup;

use App\Contracts\Bus\CommandHandler;
use App\Support\SettingsWriter;
use App\Support\SettingTargets;
use App\Values\SettingsChange;

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
