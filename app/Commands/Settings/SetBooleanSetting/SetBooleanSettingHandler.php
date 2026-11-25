<?php

declare(strict_types=1);

namespace App\Commands\Settings\SetBooleanSetting;

use App\Contracts\Bus\CommandHandler;
use App\Declarations\BooleanSetting;
use App\Enums\Settings\SettingType;
use App\Support\SettingCodec;
use App\Support\SettingsWriter;
use App\Support\SettingTargets;
use App\Values\SettingsChange;

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
