<?php

declare(strict_types=1);

namespace App\Commands\SetStringSetting;

use App\Contracts\CommandHandler;
use App\Declarations\StringSetting;
use App\Enums\SettingType;
use App\Support\SettingCodec;
use App\Support\SettingsWriter;
use App\Support\SettingTargets;
use App\Values\SettingsChange;

/**
 * Stores a text setting's value after checking who asks, what it names and the value.
 */
final readonly class SetStringSettingHandler implements CommandHandler
{
    public function __construct(
        private SettingTargets $targets,
        private SettingCodec $codec,
        private SettingsWriter $writer,
    ) {}

    public function handle(SetStringSettingCommand $command): SettingsChange
    {
        $setting = $this->targets->setting($command->setting, StringSetting::class, SettingType::String);

        return $this->writer->setValue(
            $setting,
            $this->codec->encodeString($command->setting->owner, $setting, $command->settingText),
            $command->expectedRevision,
        );
    }
}
