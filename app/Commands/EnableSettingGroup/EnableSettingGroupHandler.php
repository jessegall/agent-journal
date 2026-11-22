<?php

declare(strict_types=1);

namespace App\Commands\EnableSettingGroup;

use App\Contracts\Bus\CommandHandler;
use App\Support\SettingsWriter;
use App\Support\SettingTargets;
use App\Values\SettingsChange;

/**
 * Switches on a group after checking who asks and that the group can be switched.
 */
final readonly class EnableSettingGroupHandler implements CommandHandler
{
    public function __construct(private SettingTargets $targets, private SettingsWriter $writer) {}

    public function handle(EnableSettingGroupCommand $command): SettingsChange
    {

        return $this->writer->setToggle($this->targets->toggleGroup($command->group), true, $command->expectedRevision);
    }
}
