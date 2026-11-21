<?php

declare(strict_types=1);

namespace App\Settings\Policies;

use App\Actors\Contracts\OwnerPolicy;
use App\Settings\Models\SettingsRecord;

/**
 * Who may administer the journal settings: only the owner holds the access, so the grants decide.
 */
final readonly class SettingPolicy implements OwnerPolicy
{
    public static function model(): string
    {
        return SettingsRecord::class;
    }
}
