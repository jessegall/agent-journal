<?php

declare(strict_types=1);

namespace App\Commands\Settings\SetBooleanSetting;

use App\Attributes\Commands\Authorize;
use App\Enums\Agents\AccessType;
use App\Policies\SettingPolicy;
use App\Support\Command;
use App\Values\SettingReference;
use App\Values\SettingsChange;

/**
 * Stores an on-or-off setting's value as the owner's next revision.
 *
 * @extends Command<SettingsChange>
 */
#[Authorize(SettingPolicy::class, AccessType::Edit)]
final readonly class SetBooleanSettingCommand extends Command
{
    public function __construct(
        public SettingReference $setting,
        public bool $isEnabled,
        public int $expectedRevision,
    ) {}
}
