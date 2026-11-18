<?php

declare(strict_types=1);

namespace App\Settings\Handlers;

use App\Settings\Commands\SetStringChoice;
use App\Settings\Declarations\ChoiceSetting;
use App\Settings\Declarations\EnumSetting;
use App\Settings\Enums\SettingType;
use App\Settings\Exceptions\SettingValueInvalid;
use App\Settings\Support\SettingCodec;
use App\Settings\Support\SettingsWriter;
use App\Settings\Support\SettingTargets;
use App\Settings\Values\SettingsChange;

/**
 * Stores the chosen text option of a choice or string-backed enum setting after checking who asks, what it names and that the option is one of its own.
 */
final readonly class SetStringChoiceHandler
{
    public function __construct(private SettingTargets $targets, private SettingCodec $codec, private SettingsWriter $writer) {}

    public function handle(SetStringChoice $command): SettingsChange
    {
        $owner = $command->setting->owner;
        $setting = $this->targets->anySetting($command->setting);
        $value = match (true) {
            $setting instanceof ChoiceSetting => $this->codec->encodeChoice($owner, $setting, $command->value),
            $setting instanceof EnumSetting => $this->codec->encodeEnumValue($owner, $setting, $command->value),
            default => throw SettingValueInvalid::for($owner, $command->setting->key, SettingType::Choice),
        };

        return $this->writer->setValue($setting, $value, $command->expectedRevision);
    }
}
