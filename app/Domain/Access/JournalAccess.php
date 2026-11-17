<?php

declare(strict_types=1);

namespace App\Domain\Access;

use App\Domain\Access\Models\User;

/**
 * Who may use the journal: only the configured owner. With no owner configured, nobody gets in; signing up or being
 * the first account grants nothing.
 */
final readonly class JournalAccess
{
    public function __construct(private AccessSettings $settings) {}

    public function allows(User $person): bool
    {
        return $this->settings->ownerId !== null && $person->id === $this->settings->ownerId;
    }
}
