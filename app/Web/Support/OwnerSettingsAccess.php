<?php

declare(strict_types=1);

namespace App\Web\Support;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\JournalAccessPolicy;
use App\Settings\Contracts\SettingsAccessPolicy;

/**
 * Lets into the settings exactly the actors who may use the journal: its configured owner.
 */
final readonly class OwnerSettingsAccess implements SettingsAccessPolicy
{
    public function __construct(private JournalAccessPolicy $access) {}

    public function allows(Actor $actor): bool
    {
        return $this->access->allows($actor);
    }
}
