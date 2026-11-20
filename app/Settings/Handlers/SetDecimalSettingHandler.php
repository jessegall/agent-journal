<?php

declare(strict_types=1);

namespace App\Settings\Handlers;

use App\Contracts\CommandHandler;
use App\Settings\Commands\SetDecimalSetting;
use App\Settings\Declarations\DecimalSetting;
use App\Settings\Enums\SettingType;
use App\Settings\Support\SettingCodec;
use App\Settings\Support\SettingsWriter;
use App\Settings\Support\SettingTargets;
use App\Settings\Values\SettingsChange;

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

    public function handle(SetDecimalSetting $command): SettingsChange
    {
        $setting = $this->targets->setting($command->setting, DecimalSetting::class, SettingType::Decimal);

        return $this->writer->setValue(
            $setting,
            $this->codec->encodeDecimal($command->setting->owner, $setting, $command->settingDecimal),
            $command->expectedRevision,
        );
    }
}
