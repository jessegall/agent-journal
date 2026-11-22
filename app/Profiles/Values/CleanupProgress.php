<?php

declare(strict_types=1);

namespace App\Profiles\Values;

/**
 * What a host proved of one cleanup, as two separate proofs: the driver's own check shows no sign-in left in its
 * store, such as the Keychain, and the folder no longer exists. A missing folder alone proves nothing of the store.
 */
final readonly class CleanupProgress
{
    /**
     * How many times a host tries a cleanup on its own before it waits for the owner's Retry.
     */
    public const int MOST_TRIES = 3;

    public function __construct(
        public bool $isStoreRemoved,
        public bool $isDirectoryRemoved,
        // A displaced folder a running session's container still binds: nothing was tried, so no try counts.
        public bool $isStillBound = false,
    ) {}

    public static function stillBound(): self
    {
        return new self(false, false, true);
    }

    public function isComplete(): bool
    {
        return $this->isStoreRemoved && $this->isDirectoryRemoved;
    }
}
