<?php

declare(strict_types=1);

namespace App\Commands\ResetSetting;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Policies\SettingPolicy;
use App\Support\Command;
use App\Values\SettingReference;
use App\Values\SettingsChange;

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
