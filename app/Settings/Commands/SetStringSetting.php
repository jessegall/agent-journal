<?php

declare(strict_types=1);

namespace App\Settings\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use App\Settings\Enums\SettingAbility;
use App\Settings\Handlers\SetStringSettingHandler;
use App\Settings\Models\SettingsRecord;
use App\Settings\Policies\SettingPolicy;
use App\Settings\Values\SettingReference;
use App\Settings\Values\SettingsChange;

/**
 * Stores a text setting's value as the owner's next revision.
 *
 * @extends Command<SettingsChange>
 */
#[HandledBy(SetStringSettingHandler::class)]
#[Authorize(SettingPolicy::class, SettingAbility::Administer)]
#[Operation('set_string_setting', ResourceAreaType::JournalControl, AccessType::Edit)]
final readonly class SetStringSetting extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public SettingReference $setting,
        public string $value,
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
