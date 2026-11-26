<?php

declare(strict_types=1);

namespace App\Settings\Commands\SetBooleanSetting;

use App\Bus\Contracts\CommandHandler;
use App\Settings\Declarations\BooleanSetting;
use App\Settings\Enums\SettingType;
use App\Settings\SettingCodec;
use App\Settings\SettingsWriter;
use App\Settings\SettingTargets;
use App\Settings\Values\SettingsChange;

/**
 * Stores an on-or-off setting's value after checking who asks and what it names.
 */
final readonly class SetBooleanSettingHandler implements CommandHandler
{
    public function __construct(
        private SettingTargets $targets,
        private SettingCodec $codec,
        private SettingsWriter $writer,
    ) {}

    public function handle(SetBooleanSettingCommand $command): SettingsChange
    {
        $setting = $this->targets->setting($command->setting, BooleanSetting::class, SettingType::Boolean);

        return $this->writer->setValue(
            $setting,
            $this->codec->encodeBoolean($command->isEnabled),
            $command->expectedRevision,
        );
    }
}
