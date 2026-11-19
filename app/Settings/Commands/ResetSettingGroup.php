<?php

declare(strict_types=1);

namespace App\Settings\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use App\Settings\Enums\SettingAbility;
use App\Settings\Handlers\ResetSettingGroupHandler;
use App\Settings\Models\SettingsRecord;
use App\Settings\Policies\SettingPolicy;
use App\Settings\Values\GroupReference;
use App\Settings\Values\SettingsChange;

/**
 * Removes a group's stored switch so it follows its declared default again, keeping its settings' values.
 *
 * @extends Command<SettingsChange>
 */
#[HandledBy(ResetSettingGroupHandler::class)]
#[Authorize(SettingPolicy::class, SettingAbility::Administer)]
final readonly class ResetSettingGroup extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public GroupReference $group,
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
