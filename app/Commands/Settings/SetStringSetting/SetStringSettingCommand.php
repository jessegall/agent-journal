<?php

declare(strict_types=1);

namespace App\Commands\Settings\SetStringSetting;

use App\Attributes\Authorize;
use App\Enums\Agents\AccessType;
use App\Policies\SettingPolicy;
use App\Support\Command;
use App\Values\SettingReference;
use App\Values\SettingsChange;

/**
 * Stores a text setting's value as the owner's next revision.
 *
 * @extends Command<SettingsChange>
 */
#[Authorize(SettingPolicy::class, AccessType::Edit)]
final readonly class SetStringSettingCommand extends Command
{
    public function __construct(
        public SettingReference $setting,
        public string $settingText,
        public int $expectedRevision,
    ) {}
}
