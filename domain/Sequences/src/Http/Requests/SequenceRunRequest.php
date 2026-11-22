<?php

declare(strict_types=1);

namespace Domain\Sequences\Http\Requests;

use App\Http\Requests\Web\Concerns\ReadsRouteNumber;
use Domain\Sequences\Models\SequenceRun;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * The run a page shows, named by its number in the route; a number no run has is not found.
 */
final class SequenceRunRequest extends FormRequest
{
    use ReadsRouteNumber;

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [];
    }

    public function runId(): string
    {
        return SequenceRun::idOfNumber($this->routeNumber('run')) ?? throw new NotFoundHttpException();
    }
}
