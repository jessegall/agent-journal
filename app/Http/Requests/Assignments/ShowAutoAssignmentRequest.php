<?php

declare(strict_types=1);

namespace App\Http\Requests\Assignments;

use App\Http\Requests\Assignments\Concerns\ReadsAutoAssignmentInput;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Which auto-assignment to show: one actor and one record type.
 */
final class ShowAutoAssignmentRequest extends FormRequest
{
    use ReadsAutoAssignmentInput;

    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [...$this->keyRules()];
    }
}
