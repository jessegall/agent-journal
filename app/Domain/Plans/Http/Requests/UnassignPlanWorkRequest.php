<?php

declare(strict_types=1);

namespace App\Domain\Plans\Http\Requests;

use App\Domain\Plans\Http\Requests\Concerns\ReadsPlanWorkInput;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Which plan or phase to release as a whole, and the assignment its root is expected to have.
 */
final class UnassignPlanWorkRequest extends FormRequest
{
    use ReadsPlanWorkInput;

    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [...$this->rootRules(), ...$this->expectedRootRules()];
    }
}
