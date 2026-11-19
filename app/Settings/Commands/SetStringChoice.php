<?php

declare(strict_types=1);

namespace App\Settings\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Settings\Handlers\SetStringChoiceHandler;
use App\Settings\Values\SettingReference;
use App\Settings\Values\SettingsChange;

/**
 * Stores the chosen text option of a choice or string-backed enum setting as the owner's next revision.
 *
 * @implements Command<SettingsChange>
 */
#[HandledBy(SetStringChoiceHandler::class)]
final readonly class SetStringChoice implements Command
{
    public function __construct(
        public SettingReference $setting,
        public string $value,
        public int $expectedRevision,
    ) {}
}
