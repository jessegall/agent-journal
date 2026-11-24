<?php

declare(strict_types=1);

namespace App\Events;

use App\Values\ProfileKey;

/**
 * A profile's revision was revoked, after its transaction committed. The fence of its sessions is already retained in
 * that transaction; this fact is for other subscribers and is not kept to replay.
 */
final readonly class ProfileRevisionRevoked extends AccountEvent
{
    public function __construct(
        public ProfileKey $key,
        public int $revision,
        public string $revisionReference,
    ) {}
}
