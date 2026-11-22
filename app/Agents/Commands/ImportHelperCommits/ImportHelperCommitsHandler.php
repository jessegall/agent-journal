<?php

declare(strict_types=1);

namespace App\Agents\Commands\ImportHelperCommits;

use App\Agents\Support\HelperCommitImport;
use App\Agents\Values\HelperImportReceipt;
use App\Contracts\CommandHandler;

/**
 * Imports only work a passed stop certified, and answers its ref and commits.
 */
final readonly class ImportHelperCommitsHandler implements CommandHandler
{
    public function __construct(private HelperCommitImport $import) {}

    public function handle(ImportHelperCommitsCommand $command): HelperImportReceipt
    {
        return $this->import->importCertified($command->work, $command->certificate);
    }
}
