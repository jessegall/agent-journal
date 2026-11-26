<?php

declare(strict_types=1);

namespace App\Settings\Commands\ResetSetting;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\SettingPolicy;
use App\Settings\Values\SettingReference;
use App\Settings\Values\SettingsChange;
use App\Support\Command;

/**
 * Removes a setting's override so it follows its declared default again.
 *
 * @extends Command<SettingsChange>
 */
#[Authorize(SettingPolicy::class, AccessType::Edit)]
final readonly class ResetSettingCommand extends Command
{
    public function __construct(
        public SettingReference $setting,
        public int $expectedRevision,
    ) {}
}
