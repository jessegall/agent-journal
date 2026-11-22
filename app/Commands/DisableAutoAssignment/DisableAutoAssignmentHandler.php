<?php

declare(strict_types=1);

namespace App\Commands\DisableAutoAssignment;

use App\Contracts\Bus\CommandHandler;
use App\Support\AutoAssignmentAdmission;
use App\Support\AutoAssignmentChange;
use App\Support\Storage\DatabaseAutoAssignments;

/**
 * Admits the change, then turns the auto-assignment off inside the command's repeatable-read transaction.
 */
final readonly class DisableAutoAssignmentHandler implements CommandHandler
{
    public function __construct(
        private AutoAssignmentAdmission $admission,
        private DatabaseAutoAssignments $writer,
    ) {}

    public function handle(DisableAutoAssignmentCommand $command): AutoAssignmentChange
    {
        $this->admission->admitKey($command->key);

        return $this->writer->disable($command->key, $command->expectedRevision);
    }
}
