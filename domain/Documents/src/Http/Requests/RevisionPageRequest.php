<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Requests;

use App\Http\Requests\Web\Concerns\ReadsRouteNumber;
use Illuminate\Foundation\Http\FormRequest;

/**
 * The document and revision a revision page shows.
 */
final class RevisionPageRequest extends FormRequest
{
    use ReadsRouteNumber;

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [];
    }

    public function documentNumber(): int
    {
        return $this->routeNumber('document');
    }

    public function revisionNumber(): int
    {
        return $this->routeNumber('revision');
    }
}
