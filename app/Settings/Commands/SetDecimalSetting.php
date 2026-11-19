<?php

declare(strict_types=1);

namespace App\Settings\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Settings\Handlers\SetDecimalSettingHandler;
use App\Settings\Values\Decimal;
use App\Settings\Values\SettingReference;
use App\Settings\Values\SettingsChange;

/**
 * Stores an exact decimal setting's value as the owner's next revision.
 *
 * @implements Command<SettingsChange>
 */
#[HandledBy(SetDecimalSettingHandler::class)]
final readonly class SetDecimalSetting implements Command
{
    public function __construct(
        public SettingReference $setting,
        public Decimal $value,
        public int $expectedRevision,
    ) {}
}
