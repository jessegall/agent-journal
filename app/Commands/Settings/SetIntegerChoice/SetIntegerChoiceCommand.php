<?php

declare(strict_types=1);

namespace App\Commands\Settings\SetIntegerChoice;

use App\Attributes\Authorize;
use App\Enums\Agents\AccessType;
use App\Policies\SettingPolicy;
use App\Support\Command;
use App\Values\SettingReference;
use App\Values\SettingsChange;

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
