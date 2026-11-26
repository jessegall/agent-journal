<?php

declare(strict_types=1);

namespace App\Assignments\Commands\ConfigureAutoAssignment;

use App\Assignments\AutoAssignmentAdmission;
use App\Assignments\AutoAssignmentChange;
use App\Assignments\Storage\DatabaseAutoAssignments;
use App\Bus\Contracts\CommandHandler;

/**
 * Admits the change, then writes it inside the command's repeatable-read transaction; a refusal writes nothing.
 */
final readonly class ConfigureAutoAssignmentHandler implements CommandHandler
{
    public function __construct(
        private AutoAssignmentAdmission $admission,
        private DatabaseAutoAssignments $writer,
    ) {}

    public function handle(ConfigureAutoAssignmentCommand $command): AutoAssignmentChange
    {
        $this->admission->admitInput($command->input);

        return $this->writer->configure($command->input, $command->expectedRevision);
    }
}
