<?php

declare(strict_types=1);

namespace App\Assignments\Commands\DisableAutoAssignment;

use App\Assignments\AutoAssignmentAdmission;
use App\Assignments\AutoAssignmentChange;
use App\Assignments\Storage\DatabaseAutoAssignments;
use App\Bus\Contracts\CommandHandler;

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
