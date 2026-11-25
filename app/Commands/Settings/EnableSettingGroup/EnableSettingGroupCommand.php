<?php

declare(strict_types=1);

namespace App\Commands\Settings\EnableSettingGroup;

use App\Attributes\Authorize;
use App\Enums\Agents\AccessType;
use App\Policies\SettingPolicy;
use App\Support\Command;
use App\Values\GroupReference;
use App\Values\SettingsChange;

/**
 * Switches on a group that can be switched off, keeping its settings' values.
 *
 * @extends Command<SettingsChange>
 */
#[Authorize(SettingPolicy::class, AccessType::Edit)]
final readonly class EnableSettingGroupCommand extends Command
{
    public function __construct(
        public GroupReference $group,
        public int $expectedRevision,
    ) {}
}
