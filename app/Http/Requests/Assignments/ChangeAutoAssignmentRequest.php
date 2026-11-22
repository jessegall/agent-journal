<?php

declare(strict_types=1);

namespace App\Http\Requests\Assignments;

use App\Commands\ConfigureAutoAssignment\ConfigureAutoAssignmentCommand;
use App\Commands\EnableAutoAssignment\EnableAutoAssignmentCommand;
use App\Contracts\Records\RecordResolver;
use App\Http\Requests\Assignments\Concerns\ReadsAutoAssignmentInput;
use Illuminate\Foundation\Http\FormRequest;

/**
 * An auto-assignment to enable or configure: whose, for which record type, its pool, size and the revision read.
 */
final class ChangeAutoAssignmentRequest extends FormRequest
{
    use ReadsAutoAssignmentInput;

    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [...$this->keyRules(), ...$this->poolRules(), ...$this->revisionRules()];
    }

    public function enableCommand(RecordResolver $records): EnableAutoAssignmentCommand
    {
        return new EnableAutoAssignmentCommand($this->autoAssignmentInput($records), $this->expectedRevision());
    }

    public function configureCommand(RecordResolver $records): ConfigureAutoAssignmentCommand
    {
        return new ConfigureAutoAssignmentCommand($this->autoAssignmentInput($records), $this->expectedRevision());
    }
}
