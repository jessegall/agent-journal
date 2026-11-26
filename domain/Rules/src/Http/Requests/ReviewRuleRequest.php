<?php

declare(strict_types=1);

namespace Domain\Rules\Http\Requests;

use App\Http\Requests\Concerns\ReadsChosenProject;
use App\Http\Requests\Web\Concerns\ReadsRouteNumber;
use Domain\Rules\Models\Rule;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Which proposed rule to review, named by the route; by the record's number; a number no record has is not found
 * before any work; an approval may name the project or Global it holds for.
 */
final class ReviewRuleRequest extends FormRequest
{
    use ReadsChosenProject;
    use ReadsRouteNumber;

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return $this->projectRules();
    }

    public function ruleId(): string
    {
        return Rule::resolveIdOfNumber($this->routeNumber('rule')) ?? throw new NotFoundHttpException();
    }
}
