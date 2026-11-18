<?php

declare(strict_types=1);

namespace App\Web\Support;

use App\Actors\Contracts\Actor;
use App\Settings\Contracts\SettingsAccessPolicy;
use App\Web\Contracts\JournalAccessPolicy;

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
