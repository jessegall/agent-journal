<?php

declare(strict_types=1);

namespace App\Assignments\Http\Requests;

use App\Assignments\Http\Requests\Concerns\ReadsAssignmentInput;
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
    public function rules(): array
    {
        return [...$this->recordRules(), ...$this->expectedRules(), ...$this->recipientRules()];
    }
}
