<?php

declare(strict_types=1);

namespace App\Settings\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Settings\Enums\SettingAbility;
use App\Settings\Handlers\DisableSettingGroupHandler;
use App\Settings\Models\SettingsRecord;
use App\Settings\Policies\SettingPolicy;
use App\Settings\Values\GroupReference;
use App\Settings\Values\SettingsChange;

/**
 * Switches off a group that can be switched off, keeping its settings' values.
 *
 * @implements Command<SettingsChange>
 */
#[HandledBy(DisableSettingGroupHandler::class)]
#[Authorize(SettingPolicy::class, SettingAbility::Administer)]
final readonly class DisableSettingGroup implements Command, HasAuthorizationSubject
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
