<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use App\Profiles\Enums\CleanupTarget;
use App\Profiles\Enums\SignInMethod;

/**
 * A cleanup a host took: what it cleans, by id, its driver and method, its folder on the host, the generation to report in and
 * whether the driver's sign-in store was already proven gone.
 */
final readonly class ClaimedCleanup
{
    public function __construct(
        public CleanupTarget $target,
        public string $id,
        public string $driver,
        public SignInMethod $method,
        public string $directory,
        public int $generation,
        public bool $isStoreRemoved,
        // The account whose folder this is, none for a new account's attempt.
        public string|null $accountId,
    ) {}

    /**
     * Whether this is the folder a live account's promotion displaced: an attempt's cleanup with an account, whose
     * running sessions keep the folder to the end of their run.
     */
    public function isDisplacedFolder(): bool
    {
        return $this->target === CleanupTarget::SignInAttempt && $this->accountId !== null;
    }
}
