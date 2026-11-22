<?php

declare(strict_types=1);

namespace App\Commands\SetDecimalSetting;

use App\Contracts\Bus\CommandHandler;
use App\Declarations\DecimalSetting;
use App\Enums\SettingType;
use App\Support\SettingCodec;
use App\Support\SettingsWriter;
use App\Support\SettingTargets;
use App\Values\SettingsChange;

/**
 * Stores an exact decimal setting's value after checking who asks, what it names and the value.
 */
final readonly class SetDecimalSettingHandler implements CommandHandler
{
    public function __construct(
        private SettingTargets $targets,
        private SettingCodec $codec,
        private SettingsWriter $writer,
    ) {}

    public function handle(SetDecimalSettingCommand $command): SettingsChange
    {
        $setting = $this->targets->setting($command->setting, DecimalSetting::class, SettingType::Decimal);

        return $this->writer->setValue(
            $setting,
            $this->codec->encodeDecimal($command->setting->owner, $setting, $command->settingDecimal),
            $command->expectedRevision,
        );
    }
}
