<?php

declare(strict_types=1);

namespace App\Http\Requests\Assignments;

use App\Assignments\Commands\ConfigureAutoAssignment;
use App\Assignments\Commands\EnableAutoAssignment;
use App\Http\Requests\Assignments\Concerns\ReadsAutoAssignmentInput;
use App\Records\Contracts\RecordResolver;
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

    public function enableCommand(RecordResolver $records): EnableAutoAssignment
    {
        return new EnableAutoAssignment($this->autoAssignmentInput($records), $this->expectedRevision());
    }

    public function configureCommand(RecordResolver $records): ConfigureAutoAssignment
    {
        return new ConfigureAutoAssignment($this->autoAssignmentInput($records), $this->expectedRevision());
    }
}
