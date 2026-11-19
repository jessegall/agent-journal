<?php

declare(strict_types=1);

namespace App\Settings\Handlers;

use App\Contracts\CommandHandler;
use App\Settings\Commands\SetIntegerSetting;
use App\Settings\Declarations\IntegerSetting;
use App\Settings\Enums\SettingType;
use App\Settings\Support\SettingCodec;
use App\Settings\Support\SettingsWriter;
use App\Settings\Support\SettingTargets;
use App\Settings\Values\SettingsChange;

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

    public function handle(SetIntegerSetting $command): SettingsChange
    {
        $setting = $this->targets->setting($command->setting, IntegerSetting::class, SettingType::Integer);

        return $this->writer->setValue(
            $setting,
            $this->codec->encodeInteger($command->setting->owner, $setting, $command->value),
            $command->expectedRevision,
        );
    }
}
