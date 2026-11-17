<?php

declare(strict_types=1);

namespace App\Domain\Plans\Http\Requests;

use App\Core\Web\Http\Requests\Concerns\ReadsRouteId;
use Illuminate\Foundation\Http\FormRequest;

/**
 * The plan a record page shows, named by its route; an id that is no positive whole number in range is not found.
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

    public function planId(): int
    {
        return $this->routeId('plan');
    }
}
