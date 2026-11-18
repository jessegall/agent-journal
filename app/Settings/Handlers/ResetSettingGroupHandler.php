<?php

declare(strict_types=1);

namespace App\Settings\Handlers;

use App\Settings\Commands\ResetSettingGroup;
use App\Settings\Support\SettingsWriter;
use App\Settings\Support\SettingTargets;
use App\Settings\Values\SettingsChange;

/**
 * Removes a group's stored switch after checking who asks and that the group can be switched, so it follows its default.
 */
final readonly class ResetSettingGroupHandler
{
    public function __construct(private SettingTargets $targets, private SettingsWriter $writer) {}

    public function handle(ResetSettingGroup $command): SettingsChange
    {
        return $this->writer->resetToggle($this->targets->toggleGroup($command->group), $command->expectedRevision);
    }
}
