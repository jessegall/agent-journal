<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use App\Agents\Exceptions\LaunchRecordMissing;
use App\Agents\Support\LaunchRecordDetails;

/**
 * Reads launch records: an agent its own, and the owner of a job the launches made for it.
 */
interface LaunchRecordResolver
{
    public const int MOST_PER_OWNER = 50;

    /**
     * The calling agent's own launch under this request id; another agent's answers as missing.
     *
     * @throws LaunchRecordMissing
     */
    public function own(string $requestId): LaunchRecordDetails;

    /**
     * The launches made for one owner reference, newest first, at most 50; the owner checks its own authority first.
     *
     * @return list<LaunchRecordDetails>
     */
    public function forOwnerReference(string $ownerReference): array;
}
