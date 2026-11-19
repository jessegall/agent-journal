<?php

declare(strict_types=1);

namespace App\Settings\Handlers;

use App\Contracts\CommandHandler;
use App\Settings\Commands\DisableSettingGroup;
use App\Settings\Support\SettingsWriter;
use App\Settings\Support\SettingTargets;
use App\Settings\Values\SettingsChange;

/**
 * Switches off a group after checking who asks and that the group can be switched; its settings keep their values.
 */
final readonly class DisableSettingGroupHandler implements CommandHandler
{
    public function __construct(private SettingTargets $targets, private SettingsWriter $writer) {}

    public function handle(DisableSettingGroup $command): SettingsChange
    {

        return $this->writer->setToggle(
            $this->targets->toggleGroup($command->group),
            false,
            $command->expectedRevision,
        );
    }
}
