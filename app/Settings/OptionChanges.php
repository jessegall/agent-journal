<?php

declare(strict_types=1);

namespace App\Settings;

use App\Settings\Contracts\OptionSetting;
use App\Settings\Enums\SettingType;
use App\Settings\Exceptions\SettingsAccessDenied;
use App\Settings\Exceptions\SettingUnavailable;
use App\Settings\Exceptions\SettingValueInvalid;
use App\Settings\Values\SettingReference;
use App\Settings\Values\SettingsChange;

/**
 * Stores the chosen option of a choice or backed enum setting after checking who asks, what it names and that the
 * option is one of its own.
 */
final readonly class OptionChanges
{
    public function __construct(
        private SettingTargets $targets,
        private SettingCodec $codec,
        private SettingsWriter $writer,
    ) {}

    /**
     * @throws SettingsAccessDenied
     * @throws SettingUnavailable
     * @throws SettingValueInvalid
     */
    public function choose(SettingReference $reference, string|int $option, int $expectedRevision): SettingsChange
    {
        $setting = $this->targets->setting($reference, OptionSetting::class, SettingType::Choice);

        $encodedOption = $this->codec->encodeOption($reference->owner, $setting, $option);

        return $this->writer->setValue($setting, $encodedOption, $expectedRevision);
    }
}
