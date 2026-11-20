<?php

declare(strict_types=1);

namespace App\Settings\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Settings\Handlers\SetDecimalSettingHandler;
use App\Settings\Policies\SettingPolicy;
use App\Settings\Values\Decimal;
use App\Settings\Values\SettingReference;
use App\Settings\Values\SettingsChange;

/**
 * Stores an exact decimal setting's value as the owner's next revision.
 *
 * @extends Command<SettingsChange>
 */
#[HandledBy(SetDecimalSettingHandler::class)]
#[Authorize(SettingPolicy::class, AccessType::Edit)]
final readonly class SetDecimalSetting extends Command
{
    public function __construct(
        public SettingReference $setting,
        public Decimal $settingDecimal,
        public int $expectedRevision,
    ) {}
}
