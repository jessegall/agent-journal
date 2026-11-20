<?php

declare(strict_types=1);

namespace App\Settings\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Settings\Handlers\ResetSettingHandler;
use App\Settings\Policies\SettingPolicy;
use App\Settings\Values\SettingReference;
use App\Settings\Values\SettingsChange;

/**
 * Removes a setting's override so it follows its declared default again.
 *
 * @extends Command<SettingsChange>
 */
#[HandledBy(ResetSettingHandler::class)]
#[Authorize(SettingPolicy::class, AccessType::Edit)]
final readonly class ResetSetting extends Command
{
    public function __construct(
        public SettingReference $setting,
        public int $expectedRevision,
    ) {}
}
