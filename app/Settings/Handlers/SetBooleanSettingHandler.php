<?php

declare(strict_types=1);

namespace App\Settings\Handlers;

use App\Settings\Commands\SetBooleanSetting;
use App\Settings\Declarations\BooleanSetting;
use App\Settings\Enums\SettingType;
use App\Settings\Support\SettingCodec;
use App\Settings\Support\SettingsWriter;
use App\Settings\Support\SettingTargets;
use App\Settings\Values\SettingsChange;

/**
 * Stores an on-or-off setting's value after checking who asks and what it names.
 */
final readonly class SetBooleanSettingHandler
{
    public function __construct(private SettingTargets $targets, private SettingCodec $codec, private SettingsWriter $writer) {}

    public function handle(SetBooleanSetting $command): SettingsChange
    {
        $setting = $this->targets->setting($command->setting, BooleanSetting::class, SettingType::Boolean);

        return $this->writer->setValue($setting, $this->codec->encodeBoolean($setting, $command->value), $command->expectedRevision);
    }
}
