<?php

declare(strict_types=1);

namespace App\Settings\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use App\Settings\Enums\SettingAbility;
use App\Settings\Handlers\SetIntegerSettingHandler;
use App\Settings\Models\SettingsRecord;
use App\Settings\Policies\SettingPolicy;
use App\Settings\Values\SettingReference;
use App\Settings\Values\SettingsChange;

/**
 * Stores a whole-number setting's value as the owner's next revision.
 *
 * @extends Command<SettingsChange>
 */
#[HandledBy(SetIntegerSettingHandler::class)]
#[Authorize(SettingPolicy::class, SettingAbility::Administer)]
final readonly class SetIntegerSetting extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public SettingReference $setting,
        public int $value,
        public int $expectedRevision,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return SettingsRecord::class;
    }
}
