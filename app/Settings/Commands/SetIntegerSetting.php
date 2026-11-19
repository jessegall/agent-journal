<?php

declare(strict_types=1);

namespace App\Settings\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Settings\Handlers\SetIntegerSettingHandler;
use App\Settings\Values\SettingReference;
use App\Settings\Values\SettingsChange;

/**
 * Stores a whole-number setting's value as the owner's next revision.
 *
 * @implements Command<SettingsChange>
 */
#[HandledBy(SetIntegerSettingHandler::class)]
final readonly class SetIntegerSetting implements Command
{
    public function __construct(
        public SettingReference $setting,
        public int $value,
        public int $expectedRevision,
    ) {}
}
