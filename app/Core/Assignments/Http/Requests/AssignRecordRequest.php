<?php

declare(strict_types=1);

namespace App\Core\Assignments\Http\Requests;

use App\Core\Assignments\Http\Requests\Concerns\ReadsAssignmentInput;
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
    public function rules(): array
    {
        return [...$this->recordRules(), ...$this->recipientRules()];
    }
}
