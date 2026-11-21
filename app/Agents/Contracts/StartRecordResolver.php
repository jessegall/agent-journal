<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use App\Agents\Exceptions\StartRecordMissing;
use App\Agents\Support\StartRecordDetails;
use PhpOption\Option;

/**
 * Reads start records: an agent its own, the owner of a job the starts made for it, and the owner's start of the
 * session calling now, the proof of which work that session was started for.
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
     * The starts made for one owner reference, newest first, at most 50; the owner checks its own authority first.
     *
     * @return list<StartRecordDetails>
     */
    public function forOwnerReference(string $ownerReference): array;

    /**
     * The start an owner's request made for the session calling now, when one did; none for a call without a
     * session or a session no owner started.
     *
     * @return Option<StartRecordDetails>
     */
    public function currentOwnerStart(): Option;
}
