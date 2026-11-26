<?php

declare(strict_types=1);

namespace App\Access\Contracts;

use App\Exceptions\CredentialRejected;

/**
 * The authority of an agent call: the admitted profile revision its start was pinned to, loaded once per request.
 */
interface StartProfileAdmission
{
    /**
     * @throws CredentialRejected when that profile is no longer admitted or the revision does not exist
     */
    public function admit(string $profileKey, int $profileRevision): AuthoritySource;
}
