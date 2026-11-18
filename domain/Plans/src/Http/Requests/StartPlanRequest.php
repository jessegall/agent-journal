<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Requests;

use App\Http\Requests\Web\Concerns\ReadsRouteId;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Which plan to start, named by the route; an id that is no ULID is not found.
 */
final class StartPlanRequest extends FormRequest
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
