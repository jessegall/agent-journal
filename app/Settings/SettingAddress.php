<?php

declare(strict_types=1);

namespace App\Settings;

/**
 * Where a registered setting or group lives: the owner that declares it and its key there.
 */
final readonly class SettingAddress
{
    public function __construct(public string $owner, public string $key) {}
}
