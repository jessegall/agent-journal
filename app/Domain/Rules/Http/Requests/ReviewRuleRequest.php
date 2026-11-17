<?php

declare(strict_types=1);

namespace App\Domain\Rules\Http\Requests;

use App\Core\Web\Http\Requests\Concerns\ReadsRouteId;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Which proposed rule to review, named by the route; an id that is no positive whole number in range is not found
 * before any work.
 */
final class ReviewRuleRequest extends FormRequest
{
    use ReadsRouteId;

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [];
    }

    public function ruleId(): int
    {
        return $this->routeId('rule');
    }
}
