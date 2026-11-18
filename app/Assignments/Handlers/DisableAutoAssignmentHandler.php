<?php

declare(strict_types=1);

namespace App\Assignments\Handlers;

use App\Assignments\Actions\AutoAssignmentAdmission;
use App\Assignments\Commands\DisableAutoAssignment;
use App\Assignments\Contracts\AutoAssignmentWriter;
use App\Assignments\Support\AutoAssignmentChange;
use App\Contracts\CommandHandler;

/**
 * Admits the change, then turns the auto-assignment off inside the command's repeatable-read transaction.
 */
final readonly class DisableAutoAssignmentHandler implements CommandHandler
{
    public function __construct(
        private AutoAssignmentAdmission $admission,
        private AutoAssignmentWriter $writer,
    ) {}

    public function handle(DisableAutoAssignment $command): AutoAssignmentChange
    {
        $this->admission->admitKey($command->key);

        return $this->writer->disable($command->key, $command->expectedRevision);
    }
}
