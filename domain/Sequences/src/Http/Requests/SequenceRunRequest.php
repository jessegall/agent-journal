<?php

declare(strict_types=1);

namespace Domain\Sequences\Http\Requests;

use App\Http\Requests\Web\Concerns\ReadsRouteNumber;
use Domain\Sequences\Http\Requests\Concerns\ReadsRunsListAddress;
use Illuminate\Foundation\Http\FormRequest;

/**
 * The run a page shows, named by its number in the route; a number no run has is not found.
 */
final class SequenceRunRequest extends FormRequest
{
    use ReadsRouteNumber;
    use ReadsRunsListAddress;

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return ['actor' => ['nullable', 'string'], 'page' => ['nullable', 'integer', 'min:1']];
    }

    public function runNumber(): int
    {
        return $this->routeNumber('run');
    }
}
