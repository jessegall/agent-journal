<?php

declare(strict_types=1);

namespace App\Settings\Handlers;

use App\Actors\Contracts\CurrentAuthorizer;
use App\Contracts\CommandHandler;
use App\Settings\Commands\SetStringSetting;
use App\Settings\Declarations\StringSetting;
use App\Settings\Enums\SettingAbility;
use App\Settings\Enums\SettingType;
use App\Settings\Models\SettingsRecord;
use App\Settings\Policies\SettingPolicy;
use App\Settings\Support\SettingCodec;
use App\Settings\Support\SettingsWriter;
use App\Settings\Support\SettingTargets;
use App\Settings\Values\SettingsChange;

/**
 * Stores a text setting's value after checking who asks, what it names and the value.
 */
final readonly class SetStringSettingHandler implements CommandHandler
{
    public function __construct(private CurrentAuthorizer $administration, private SettingTargets $targets, private SettingCodec $codec, private SettingsWriter $writer) {}

    public function handle(SetStringSetting $command): SettingsChange
    {
        $this->administration->authorize(SettingPolicy::class, SettingsRecord::class, SettingAbility::Administer);
        $setting = $this->targets->setting($command->setting, StringSetting::class, SettingType::String);

        return $this->writer->setValue($setting, $this->codec->encodeString($command->setting->owner, $setting, $command->value), $command->expectedRevision);
    }
}
