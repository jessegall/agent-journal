<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use App\Agents\Exceptions\StartRecordMissing;
use App\Agents\Support\StartRecordDetails;

/**
 * Reads start records: an agent its own, the requester or a maintainer one receipt, and the owner of a job the starts
 * made for it.
 */
interface StartRecordResolver
{
    public const int MOST_PER_OWNER = 50;

    /**
     * The calling agent's own start under this request id; another agent's answers as missing.
     *
     * @throws StartRecordMissing
     */
    public function own(string $requestId): StartRecordDetails;

    /**
     * The receipt kept under this request id, for the actor that asked for the start or an agent maintainer; to
     * anyone else it answers as missing.
     *
     * @throws StartRecordMissing
     */
    public function receipt(string $requestId): StartRecordDetails;

    /**
     * The starts made for one owner reference, newest first, at most 50; the owner checks its own authority first.
     *
     * @return list<StartRecordDetails>
     */
    public function forOwnerReference(string $ownerReference): array;
}
