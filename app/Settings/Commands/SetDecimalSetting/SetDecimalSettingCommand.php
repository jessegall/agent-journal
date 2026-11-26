<?php

declare(strict_types=1);

namespace App\Settings\Commands\SetDecimalSetting;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\SettingPolicy;
use App\Settings\Values\Decimal;
use App\Settings\Values\SettingReference;
use App\Settings\Values\SettingsChange;
use App\Support\Command;

/**
 * Stores an exact decimal setting's value as the owner's next revision.
 *
 * @extends Command<SettingsChange>
 */
#[Authorize(SettingPolicy::class, AccessType::Edit)]
final readonly class SetDecimalSettingCommand extends Command
{
    public function __construct(
        public SettingReference $setting,
        public Decimal $settingDecimal,
        public int $expectedRevision,
    ) {}
}
