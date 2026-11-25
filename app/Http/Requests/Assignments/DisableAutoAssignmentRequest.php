<?php

declare(strict_types=1);

namespace App\Http\Requests\Assignments;

use App\Commands\Assignments\DisableAutoAssignment\DisableAutoAssignmentCommand;
use App\Contracts\Actors\ActorTypes;
use App\Http\Requests\Assignments\Concerns\ReadsAutoAssignmentInput;
use Illuminate\Foundation\Http\FormRequest;

/**
 * An auto-assignment to turn off, and the revision the caller read.
 */
final class DisableAutoAssignmentRequest extends FormRequest
{
    use ReadsAutoAssignmentInput;

    /**
     * @return array<string, list<mixed>>
     */
    public function rules(ActorTypes $actorTypes): array
    {
        return [...$this->keyRules($actorTypes), ...$this->revisionRules()];
    }

    public function command(): DisableAutoAssignmentCommand
    {
        return new DisableAutoAssignmentCommand($this->key(), $this->expectedRevision());
    }
}
