<?php

declare(strict_types=1);

namespace App\Domain\Access;

use App\Core\Actors\ActorKind;
use App\Core\Contracts\Actor;
use App\Domain\Access\Contracts\JournalAccessPolicy;

/**
 * Who may use the journal: only the configured owner. With no owner configured, nobody gets in; signing up or being
 * the first account grants nothing.
 */
final readonly class JournalAccess implements JournalAccessPolicy
{
    public function __construct(private AccessSettings $settings) {}

    public function allows(Actor $actor): bool
    {
        return $actor->actorKind() === ActorKind::Person && $actor->actorId() === $this->settings->ownerId;
    }

    /**
     * @return list<int>
     */
    public function allowedPersonIds(): array
    {
        return $this->settings->ownerId === null ? [] : [$this->settings->ownerId];
    }
}
