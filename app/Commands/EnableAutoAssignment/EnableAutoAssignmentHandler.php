<?php

declare(strict_types=1);

namespace App\Commands\EnableAutoAssignment;

use App\Contracts\CommandHandler;
use App\Support\AutoAssignmentAdmission;
use App\Support\AutoAssignmentChange;
use App\Support\Storage\DatabaseAutoAssignments;

/**
 * Admits the change, then writes it inside the command's repeatable-read transaction; a refusal writes nothing.
 */
final readonly class EnableAutoAssignmentHandler implements CommandHandler
{
    public function __construct(
        private AutoAssignmentAdmission $admission,
        private DatabaseAutoAssignments $writer,
    ) {}

    public function handle(EnableAutoAssignmentCommand $command): AutoAssignmentChange
    {
        $this->admission->admitInput($command->input);

        return $this->writer->enable($command->input, $command->expectedRevision);
    }
}
