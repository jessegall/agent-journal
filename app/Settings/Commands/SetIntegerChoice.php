<?php

declare(strict_types=1);

namespace App\Settings\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Settings\Enums\SettingAbility;
use App\Settings\Handlers\SetIntegerChoiceHandler;
use App\Settings\Models\SettingsRecord;
use App\Settings\Policies\SettingPolicy;
use App\Settings\Values\SettingReference;
use App\Settings\Values\SettingsChange;

/**
 * Stores the chosen whole-number option of a choice or int-backed enum setting as the owner's next revision.
 *
 * @implements Command<SettingsChange>
 */
#[HandledBy(SetIntegerChoiceHandler::class)]
#[Authorize(SettingPolicy::class, SettingAbility::Administer)]
final readonly class SetIntegerChoice implements Command, HasAuthorizationSubject
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
