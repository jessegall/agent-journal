<?php

declare(strict_types=1);

namespace App\Settings\Handlers;

use App\Actors\Contracts\CurrentAuthorizer;
use App\Contracts\CommandHandler;
use App\Settings\Commands\ResetSettingGroup;
use App\Settings\Enums\SettingAbility;
use App\Settings\Models\SettingsRecord;
use App\Settings\Policies\SettingPolicy;
use App\Settings\Support\SettingsWriter;
use App\Settings\Support\SettingTargets;
use App\Settings\Values\SettingsChange;

/**
 * Removes a group's stored switch after checking who asks and that the group can be switched, so it follows its default.
 */
final readonly class ResetSettingGroupHandler implements CommandHandler
{
    public function __construct(private CurrentAuthorizer $administration, private SettingTargets $targets, private SettingsWriter $writer) {}

    public function handle(ResetSettingGroup $command): SettingsChange
    {
        $this->administration->authorize(SettingPolicy::class, SettingsRecord::class, SettingAbility::Administer);

        return $this->writer->resetToggle($this->targets->toggleGroup($command->group), $command->expectedRevision);
    }
}
