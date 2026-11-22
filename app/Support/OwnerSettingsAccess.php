<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actor;
use App\Contracts\JournalAdmission;
use App\Contracts\SettingsAccessPolicy;

/**
 * Lets into the settings exactly the actors who may use the journal: its configured owner.
 */
final readonly class OwnerSettingsAccess implements SettingsAccessPolicy
{
    public function __construct(private JournalAdmission $admission) {}

    public function allows(Actor $actor): bool
    {
        return $this->admission->admits($actor);
    }
}
