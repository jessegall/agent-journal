<?php

declare(strict_types=1);

namespace App\Settings\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Settings\Policies\SettingPolicy;
use App\Settings\Values\GroupReference;
use App\Settings\Values\SettingsChange;

/**
 * Removes a group's stored switch so it follows its declared default again, keeping its settings' values.
 *
 * @extends Command<SettingsChange>
 */
#[Authorize(SettingPolicy::class, AccessType::Edit)]
final readonly class ResetSettingGroup extends Command
{
    public function __construct(
        public GroupReference $group,
        public int $expectedRevision,
    ) {}
}
