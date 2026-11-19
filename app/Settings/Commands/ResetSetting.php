<?php

declare(strict_types=1);

namespace App\Settings\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use App\Settings\Enums\SettingAbility;
use App\Settings\Handlers\ResetSettingHandler;
use App\Settings\Models\SettingsRecord;
use App\Settings\Policies\SettingPolicy;
use App\Settings\Values\SettingReference;
use App\Settings\Values\SettingsChange;

/**
 * Removes a setting's override so it follows its declared default again.
 *
 * @extends Command<SettingsChange>
 */
#[HandledBy(ResetSettingHandler::class)]
#[Authorize(SettingPolicy::class, SettingAbility::Administer)]
final readonly class ResetSetting extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public SettingReference $setting,
        public int $expectedRevision,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return SettingsRecord::class;
    }
}
