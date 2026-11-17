<?php

declare(strict_types=1);

namespace App\Domain\Plans\Http\Requests;

use App\Domain\Plans\Http\Requests\Concerns\ReadsPlanWorkInput;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Which plan or phase to give out as a whole, and to whom.
 */
final class AssignPlanWorkRequest extends FormRequest
{
    use ReadsPlanWorkInput;

    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [...$this->rootRules(), ...$this->recipientRules()];
    }
}
