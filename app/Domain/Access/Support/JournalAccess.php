<?php

declare(strict_types=1);

namespace App\Domain\Access\Support;

use App\Core\Actors\Enums\ActorKind;
use App\Core\Actors\Contracts\Actor;
use App\Core\Web\Contracts\JournalAccessPolicy;

/**
 * Who may use the journal: only the configured owner. With no owner configured, nobody gets in; signing up or being
 * the first account grants nothing.
 */
final readonly class JournalAccess implements JournalAccessPolicy
{
    public function __construct(private AccessSettings $settings) {}

    public function allows(Actor $actor): bool
    {
        return $actor->actorKind() === ActorKind::User && $actor->actorId() === $this->settings->ownerId;
    }

    /**
     * @return list<int>
     */
    public function allowedUserIds(): array
    {
        return $this->settings->ownerId === null ? [] : [$this->settings->ownerId];
    }
}
