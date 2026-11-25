<?php

declare(strict_types=1);

namespace App\Enums\Files;

/**
 * Who may read a file the funnel writes: everyone, or its owner alone, as a secret must be.
 */
enum Permissions: string
{
    case Shared = 'shared';
    case OwnerOnly = 'owner-only';

    /**
     * The permissions a new file of a place gets when the caller names none: a private place's files are its owner's.
     */
    public static function of(Place $place): self
    {
        if ($place->isPrivate()) {
            return self::OwnerOnly;
        }

        return self::Shared;
    }

    /**
     * The mode of a folder made for files of these permissions: entered by everyone, or by its owner alone.
     */
    public function folderMode(): int
    {
        return match ($this) {
            self::Shared => 0o755,
            self::OwnerOnly => 0o700,
        };
    }

    public function mode(): int
    {
        return match ($this) {
            self::Shared => 0o644,
            self::OwnerOnly => 0o600,
        };
    }
}
