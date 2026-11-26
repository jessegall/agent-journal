<?php

declare(strict_types=1);

namespace App\Http\Requests\Assignments;

use App\Actors\Contracts\ActorTypes;
use App\Http\Requests\Assignments\Concerns\ReadsAssignmentInput;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Which record to move, the assignment it is expected to have now, and the new holder.
 */
final class ReassignRecordRequest extends FormRequest
{
    use ReadsAssignmentInput;

    /**
     * @return array<string, list<mixed>>
     */
    public function rules(ActorTypes $actorTypes): array
    {
        return [...$this->recordRules(), ...$this->expectedRules($actorTypes), ...$this->recipientRules($actorTypes)];
    }
}
