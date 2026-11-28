<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Requests;

use App\Http\Requests\Concerns\ReadsChosenProject;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Plan;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * A new plan from the create dialog: its title, its goal as the brief, and its type, a choice from the permitted types.
 */
final class CreatePlanRequest extends FormRequest
{
    use ReadsChosenProject;

    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'title' => [
                'required',
                'string',
                'max:'.Plan::TITLE_CHARACTER_LIMIT,
            ],
            'brief' => [
                'required',
                'string',
                'max:'.Plan::BRIEF_CHARACTER_LIMIT,
            ],
            'type' => [
                'required',
                Rule::enum(PlanType::class),
            ],
            ...$this->projectRules(),
        ];
    }

    public function title(): string
    {
        return $this->string('title')->toString();
    }

    public function brief(): string
    {
        return $this->string('brief')->toString();
    }

    public function type(): PlanType
    {
        return $this->enum('type', PlanType::class) ?? PlanType::Build;
    }
}
