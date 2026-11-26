<?php

declare(strict_types=1);

namespace App\Settings\Commands\SetIntegerSetting;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\SettingPolicy;
use App\Settings\Values\SettingReference;
use App\Settings\Values\SettingsChange;
use App\Support\Command;

/**
 * Stores a whole-number setting's value as the owner's next revision.
 *
 * @extends Command<SettingsChange>
 */
#[Authorize(SettingPolicy::class, AccessType::Edit)]
final readonly class SetIntegerSettingCommand extends Command
{
    public function __construct(
        public SettingReference $setting,
        public int $settingNumber,
        public int $expectedRevision,
    ) {}
}
