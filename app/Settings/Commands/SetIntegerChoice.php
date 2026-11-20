<?php

declare(strict_types=1);

namespace App\Settings\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Settings\Enums\SettingAbility;
use App\Settings\Handlers\SetIntegerChoiceHandler;
use App\Settings\Models\SettingsRecord;
use App\Settings\Policies\SettingPolicy;
use App\Settings\Values\SettingReference;
use App\Settings\Values\SettingsChange;

/**
 * Stores the chosen whole-number option of a choice or int-backed enum setting as the owner's next revision.
 *
 * @extends Command<SettingsChange>
 */
#[HandledBy(SetIntegerChoiceHandler::class)]
#[Authorize(SettingPolicy::class, SettingAbility::Administer)]
#[Operation('set_integer_choice', ResourceAreaType::JournalControl, AccessType::Edit)]
final readonly class SetIntegerChoice extends Command implements AuthorizedCommand
{
    public function __construct(
        public SettingReference $setting,
        public int $selectedKey,
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
