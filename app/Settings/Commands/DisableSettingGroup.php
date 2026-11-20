<?php

declare(strict_types=1);

namespace App\Settings\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use App\Settings\Enums\SettingAbility;
use App\Settings\Handlers\DisableSettingGroupHandler;
use App\Settings\Models\SettingsRecord;
use App\Settings\Policies\SettingPolicy;
use App\Settings\Values\GroupReference;
use App\Settings\Values\SettingsChange;

/**
 * Switches off a group that can be switched off, keeping its settings' values.
 *
 * @extends Command<SettingsChange>
 */
#[HandledBy(DisableSettingGroupHandler::class)]
#[Authorize(SettingPolicy::class, SettingAbility::Administer)]
#[Operation('disable_setting_group', ResourceAreaType::JournalControl, AccessType::Edit)]
final readonly class DisableSettingGroup extends Command implements HasAuthorizationSubject
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
