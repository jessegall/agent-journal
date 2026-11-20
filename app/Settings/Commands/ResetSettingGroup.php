<?php

declare(strict_types=1);

namespace App\Settings\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
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
#[Operation('reset_setting_group', ResourceAreaType::JournalControl, AccessType::Edit)]
final readonly class ResetSettingGroup extends Command implements AuthorizedCommand
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
