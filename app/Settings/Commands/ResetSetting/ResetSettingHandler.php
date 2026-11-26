<?php

declare(strict_types=1);

namespace App\Settings\Commands\ResetSetting;

use App\Bus\Contracts\CommandHandler;
use App\Settings\SettingsWriter;
use App\Settings\SettingTargets;
use App\Settings\Values\SettingsChange;

/**
 * Removes a setting's override after checking who asks and what it names, without reading the stored value.
 */
final readonly class ResetSettingHandler implements CommandHandler
{
    public function __construct(private SettingTargets $targets, private SettingsWriter $writer) {}

    public function handle(ResetSettingCommand $command): SettingsChange
    {

        return $this->writer->reset($this->targets->anySetting($command->setting), $command->expectedRevision);
    }
}
