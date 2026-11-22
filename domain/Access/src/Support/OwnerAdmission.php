<?php

declare(strict_types=1);

namespace Domain\Access\Support;

use App\Contracts\Actors\Actor;
use App\Contracts\Admission\JournalAdmission;
use App\Exceptions\ConsoleOwnerMissing;
use App\Support\ActorContext;
use App\Support\ActorIdentity;

/**
 * Only the configured owner joins the journal. With no owner configured, nobody gets in; signing up or being the first
 * account grants nothing.
 */
final readonly class OwnerAdmission implements JournalAdmission
{
    public function __construct(private AccessSettings $settings) {}

    public function admits(Actor $actor): bool
    {
        if ($this->settings->ownerId === null) {
            return false;
        }

        return ActorIdentity::of($actor)->isSameAs(ActorIdentity::of($this->owner()));
    }

    public function owner(): ActorContext
    {
        $ownerId = $this->settings->ownerId ?? throw ConsoleOwnerMissing::forConsole();

        return ActorContext::forUser($ownerId);
    }
}
