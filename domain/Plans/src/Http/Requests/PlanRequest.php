<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Requests;

use App\Http\Requests\Web\Concerns\ReadsRouteId;
use Illuminate\Foundation\Http\FormRequest;

/**
 * The plan a record page shows, named by its route; an id that is no ULID is not found.
 */
final class PlanRequest extends FormRequest
{
    use ReadsRouteId;

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [];
    }

    public function planId(): string
    {
        return $this->routeId('plan');
    }
}
