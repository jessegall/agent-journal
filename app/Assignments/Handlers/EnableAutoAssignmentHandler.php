<?php

declare(strict_types=1);

namespace App\Assignments\Handlers;

use App\Assignments\Actions\AutoAssignmentAdmission;
use App\Assignments\Commands\EnableAutoAssignment;
use App\Assignments\Contracts\AutoAssignmentWriter;
use App\Assignments\Support\AutoAssignmentChange;
use App\Contracts\CommandHandler;

/**
 * Admits the change, then writes it inside the command's repeatable-read transaction; a refusal writes nothing.
 */
final readonly class EnableAutoAssignmentHandler implements CommandHandler
{
    public function __construct(
        private AutoAssignmentAdmission $admission,
        private AutoAssignmentWriter $writer,
    ) {}

    public function handle(EnableAutoAssignment $command): AutoAssignmentChange
    {
        $this->admission->admitInput($command->input);

        return $this->writer->enable($command->input, $command->expectedRevision);
    }
}
