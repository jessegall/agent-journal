<?php

declare(strict_types=1);

namespace App\Http\Requests\Assignments;

use App\Actors\Contracts\ActorTypes;
use App\Http\Requests\Assignments\Concerns\ReadsAssignmentInput;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Which record to give to whom; a record already held by another is refused by the writer.
 */
final class AssignRecordRequest extends FormRequest
{
    use ReadsAssignmentInput;

    /**
     * @return array<string, list<mixed>>
     */
    public function rules(ActorTypes $actorTypes): array
    {
        return [
            ...$this->recordRules(),
            ...$this->recipientRules($actorTypes),
        ];
    }
}
