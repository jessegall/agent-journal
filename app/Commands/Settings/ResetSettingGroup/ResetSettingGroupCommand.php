<?php

declare(strict_types=1);

namespace App\Commands\Settings\ResetSettingGroup;

use App\Attributes\Commands\Authorize;
use App\Enums\Agents\AccessType;
use App\Policies\SettingPolicy;
use App\Support\Command;
use App\Values\GroupReference;
use App\Values\SettingsChange;

/**
 * Removes a group's stored switch so it follows its declared default again, keeping its settings' values.
 *
 * @extends Command<SettingsChange>
 */
#[Authorize(SettingPolicy::class, AccessType::Edit)]
final readonly class ResetSettingGroupCommand extends Command
{
    public function __construct(
        public GroupReference $group,
        public int $expectedRevision,
    ) {}
}
