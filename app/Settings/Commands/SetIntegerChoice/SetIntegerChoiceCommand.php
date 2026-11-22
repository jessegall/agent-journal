<?php

declare(strict_types=1);

namespace App\Settings\Commands\SetIntegerChoice;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Settings\Policies\SettingPolicy;
use App\Settings\Values\SettingReference;
use App\Settings\Values\SettingsChange;

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
