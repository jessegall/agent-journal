<?php

declare(strict_types=1);

namespace App\Settings\Support;

/**
 * A group that can be switched off, read while it was off: it names the group and the revision, and gives no values.
 */
final readonly class DisabledSettingsGroup
{
    public function __construct(public string $owner, public string $key, public int $revision) {}
}
