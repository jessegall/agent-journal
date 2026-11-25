<?php

declare(strict_types=1);

namespace App\Http\Requests\Assignments;

use App\Contracts\Actors\ActorTypes;
use App\Http\Requests\Assignments\Concerns\ReadsAssignmentInput;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Which record to release and the assignment it is expected to have now.
 */
final class UnassignRecordRequest extends FormRequest
{
    use ReadsAssignmentInput;

    /**
     * @return array<string, list<mixed>>
     */
    public function rules(ActorTypes $actorTypes): array
    {
        return [...$this->recordRules(), ...$this->expectedRules($actorTypes)];
    }
}
