<?php

declare(strict_types=1);

namespace App\Settings\Commands\SetStringChoice;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\SettingPolicy;
use App\Settings\Values\SettingReference;
use App\Settings\Values\SettingsChange;
use App\Support\Command;

/**
 * Stores the chosen text option of a choice or string-backed enum setting as the owner's next revision.
 *
 * @extends Command<SettingsChange>
 */
#[Authorize(SettingPolicy::class, AccessType::Edit)]
final readonly class SetStringChoiceCommand extends Command
{
    public function __construct(
        public SettingReference $setting,
        public string $selectedKey,
        public int $expectedRevision,
    ) {}
}
