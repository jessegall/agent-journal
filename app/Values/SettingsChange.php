<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\SettingsOutcome;

/**
 * The result of a settings command: the owner's revision after it, and whether it changed anything.
 */
final readonly class SettingsChange
{
    public function __construct(public string $owner, public int $revision, public SettingsOutcome $outcome) {}
}
