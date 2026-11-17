<?php

declare(strict_types=1);

namespace App\Core\Assignments\Http\Requests;

use App\Core\Assignments\Http\Requests\Concerns\ReadsAssignmentInput;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Which record to show the holder of.
 */
final class ShowAssignmentRequest extends FormRequest
{
    use ReadsAssignmentInput;

    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return $this->recordRules();
    }
}
