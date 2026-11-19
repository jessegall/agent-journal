<?php

declare(strict_types=1);

namespace App\Assignments\Handlers;

use App\Assignments\Actions\AutoAssignmentAdmission;
use App\Assignments\Commands\ConfigureAutoAssignment;
use App\Assignments\Storage\DatabaseAutoAssignments;
use App\Assignments\Support\AutoAssignmentChange;
use App\Contracts\CommandHandler;

/**
 * Admits the change, then writes it inside the command's repeatable-read transaction; a refusal writes nothing.
 */
final readonly class ConfigureAutoAssignmentHandler implements CommandHandler
{
    public function __construct(
        private AutoAssignmentAdmission $admission,
        private DatabaseAutoAssignments $writer,
    ) {}

    public function handle(ConfigureAutoAssignment $command): AutoAssignmentChange
    {
        $this->admission->admitInput($command->input);

        return $this->writer->configure($command->input, $command->expectedRevision);
    }
}
