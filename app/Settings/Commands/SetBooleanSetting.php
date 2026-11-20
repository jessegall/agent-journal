<?php

declare(strict_types=1);

namespace App\Settings\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Settings\Handlers\SetBooleanSettingHandler;
use App\Settings\Policies\SettingPolicy;
use App\Settings\Values\SettingReference;
use App\Settings\Values\SettingsChange;

/**
 * Stores an on-or-off setting's value as the owner's next revision.
 *
 * @extends Command<SettingsChange>
 */
#[HandledBy(SetBooleanSettingHandler::class)]
#[Authorize(SettingPolicy::class, AccessType::Edit)]
final readonly class SetBooleanSetting extends Command
{
    public function __construct(
        public SettingReference $setting,
        public bool $enabled,
        public int $expectedRevision,
    ) {}
}
