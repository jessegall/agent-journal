<?php

declare(strict_types=1);

namespace App\Contracts\Work;

use App\Exceptions\HelperImportFailed;
use App\Exceptions\HelperWorkUncertified;
use App\Support\RecordIdentity;
use App\Values\HelperImportReceipt;

/**
 * Moves commits between the parent repository and a helper's certified checkout the protected way: the certified
 * work's commits in under their ref, and a commit of the parent out under a repair ref.
 */
interface HelperCommitImport
{
    /**
     * @throws HelperWorkUncertified
     * @throws HelperImportFailed
     */
    public function importCertified(RecordIdentity $work, string $certificate): HelperImportReceipt;

    /**
     * @throws HelperWorkUncertified
     * @throws HelperImportFailed
     */
    public function transferTarget(RecordIdentity $work, string $certificate, string $commit, string $source): string;
}
