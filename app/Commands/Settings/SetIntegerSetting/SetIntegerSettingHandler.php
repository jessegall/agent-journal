<?php

declare(strict_types=1);

namespace App\Commands\Settings\SetIntegerSetting;

use App\Contracts\Bus\CommandHandler;
use App\Declarations\IntegerSetting;
use App\Enums\Settings\SettingType;
use App\Support\SettingCodec;
use App\Support\SettingsWriter;
use App\Support\SettingTargets;
use App\Values\SettingsChange;

/**
 * Stores a whole-number setting's value after checking who asks, what it names and the value.
 */
final readonly class SetIntegerSettingHandler implements CommandHandler
{
    public function __construct(
        private SettingTargets $targets,
        private SettingCodec $codec,
        private SettingsWriter $writer,
    ) {}

    public function handle(SetIntegerSettingCommand $command): SettingsChange
    {
        $setting = $this->targets->setting($command->setting, IntegerSetting::class, SettingType::Integer);

        return $this->writer->setValue(
            $setting,
            $this->codec->encodeInteger($command->setting->owner, $setting, $command->settingNumber),
            $command->expectedRevision,
        );
    }
}
