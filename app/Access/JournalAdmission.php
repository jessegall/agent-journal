<?php

declare(strict_types=1);

namespace App\Access;

use App\Access\Contracts\JournalAdmission as JournalAdmissionContract;
use App\Actors\Contracts\Actor;
use App\Exceptions\ConsoleOwnerMissing;
use App\Support\ActorReference;

/**
 * Only the configured owner joins the journal. With no owner configured, nobody gets in; signing up or being the first
 * account grants nothing.
 */
final readonly class JournalAdmission implements JournalAdmissionContract
{
    public function __construct(private AccessSettings $settings) {}

    public function admits(Actor $actor): bool
    {
        if ($this->settings->ownerId === null) {
            return false;
        }

        return ActorReference::of($actor)->isSameAs($this->owner());
    }

    public function owner(): ActorReference
    {
        $ownerId = $this->settings->ownerId ?? throw ConsoleOwnerMissing::forConsole();

        return ActorReference::forUser($ownerId);
    }
}
