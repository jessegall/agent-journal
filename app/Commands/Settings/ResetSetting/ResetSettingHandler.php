<?php

declare(strict_types=1);

namespace App\Commands\Settings\ResetSetting;

use App\Contracts\Bus\CommandHandler;
use App\Support\SettingsWriter;
use App\Support\SettingTargets;
use App\Values\SettingsChange;

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
