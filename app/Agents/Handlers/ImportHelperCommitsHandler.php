<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\ImportHelperCommits;
use App\Agents\Models\CertifiedWork;
use App\Agents\Support\HelperCommitImport;
use App\Agents\Values\HelperImportReceipt;
use App\Contracts\CommandHandler;

/**
 * Imports only work a passed stop certified, and answers its ref and commits.
 */
final readonly class ImportHelperCommitsHandler implements CommandHandler
{
    public function __construct(private HelperCommitImport $import) {}

    public function handle(ImportHelperCommits $command): HelperImportReceipt
    {
        $work = CertifiedWork::of($command->work, $command->certificate);

        return new HelperImportReceipt($work->importRef(), $this->import->import($work));
    }
}
