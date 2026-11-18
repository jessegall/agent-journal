<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Requests;

use App\Http\Requests\Web\Concerns\ReadsRouteNumber;
use Illuminate\Foundation\Http\FormRequest;

/**
 * The number of the document or report a record page shows, from its route.
 */
final class RecordPageRequest extends FormRequest
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

    public function reportNumber(): int
    {
        return $this->routeNumber('report');
    }
}
