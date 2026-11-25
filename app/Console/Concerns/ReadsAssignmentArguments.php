<?php

declare(strict_types=1);

namespace App\Console\Concerns;

use App\Exceptions\InvalidActorText;
use App\Support\ActorIdentity;

/**
 * The record an assignment command names by its type and id arguments, and the assignment it read. The start
 * decides who calls, never an option.
 */
trait ReadsAssignmentArguments
{
    /**
     * @return array{recordType: string, recordId: string}
     */
    protected function recordFields(): array
    {
        return [
            'recordType' => (string) $this->argument('type'),
            'recordId' => (string) $this->argument('id'),
        ];
    }

    /**
     * The assignment the caller read and its holder then, from --assignment and --holder.
     *
     * @return array<string, int|string>
     *
     * @throws InvalidActorText
     */
    protected function heldFields(): array
    {
        $assignment = $this->input->getOption('assignment');
        $holder = $this->input->getOption('holder');

        return [
            'assignmentId' => is_string($assignment) ? $assignment : '',
            ...ActorIdentity::fromText(is_string($holder) ? $holder : '')->asFields('holder'),
        ];
    }
}
