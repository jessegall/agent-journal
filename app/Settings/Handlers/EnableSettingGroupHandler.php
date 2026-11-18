<?php

declare(strict_types=1);

namespace App\Settings\Handlers;

use App\Settings\Commands\EnableSettingGroup;
use App\Settings\Support\SettingsWriter;
use App\Settings\Support\SettingTargets;
use App\Settings\Values\SettingsChange;

/**
 * Switches on a group after checking who asks and that the group can be switched.
 */
final readonly class EnableSettingGroupHandler
{
    public function __construct(private SettingTargets $targets, private SettingsWriter $writer) {}

    public function handle(EnableSettingGroup $command): SettingsChange
    {
        return $this->writer->setToggle($this->targets->toggleGroup($command->group), true, $command->expectedRevision);
    }
}
