<?php

declare(strict_types=1);

namespace App\Settings\Commands\SetIntegerChoice;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\SettingPolicy;
use App\Settings\Values\SettingReference;
use App\Settings\Values\SettingsChange;
use App\Support\Command;

/**
 * Stores the chosen whole-number option of a choice or int-backed enum setting as the owner's next revision.
 *
 * @extends Command<SettingsChange>
 */
#[Authorize(SettingPolicy::class, AccessType::Edit)]
final readonly class SetIntegerChoiceCommand extends Command
{
    public function __construct(
        public SettingReference $setting,
        public int $selectedKey,
        public int $expectedRevision,
    ) {}
}
