<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Settings\OptionSetting;
use App\Enums\Settings\SettingType;
use App\Exceptions\SettingsAccessDenied;
use App\Exceptions\SettingUnavailable;
use App\Exceptions\SettingValueInvalid;
use App\Values\SettingReference;
use App\Values\SettingsChange;

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
