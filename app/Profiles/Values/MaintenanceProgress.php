<?php

declare(strict_types=1);

namespace App\Profiles\Values;

/**
 * How far an account's maintenance got: the sessions still running on it, how many unclaimed starts were cancelled,
 * whether a sign-in still writes its folder, and whether every use has ended so its sign-in may now change.
 */
final readonly class MaintenanceProgress
{
    /**
     * @param  list<string>  $runningSessionIds
     */
    public function __construct(
        public array $runningSessionIds,
        public int $cancelledStarts,
        public bool $isCredentialWriteInProgress,
        public bool $settled,
    ) {}
}
