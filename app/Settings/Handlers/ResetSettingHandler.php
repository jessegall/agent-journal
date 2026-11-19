<?php

declare(strict_types=1);

namespace App\Settings\Handlers;

use App\Actors\Contracts\CurrentAuthorizer;
use App\Contracts\CommandHandler;
use App\Settings\Commands\ResetSetting;
use App\Settings\Enums\SettingAbility;
use App\Settings\Models\SettingsRecord;
use App\Settings\Policies\SettingPolicy;
use App\Settings\Support\SettingsWriter;
use App\Settings\Support\SettingTargets;
use App\Settings\Values\SettingsChange;

/**
 * Removes a setting's override after checking who asks and what it names, without reading the stored value.
 */
final readonly class ResetSettingHandler implements CommandHandler
{
    public function __construct(private CurrentAuthorizer $administration, private SettingTargets $targets, private SettingsWriter $writer) {}

    public function handle(ResetSetting $command): SettingsChange
    {
        $this->administration->authorize(SettingPolicy::class, SettingsRecord::class, SettingAbility::Administer);

        return $this->writer->reset($this->targets->anySetting($command->setting), $command->expectedRevision);
    }
}
