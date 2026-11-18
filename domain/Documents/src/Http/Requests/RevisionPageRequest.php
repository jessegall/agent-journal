<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Requests;

use App\Http\Requests\Web\Concerns\ReadsRouteNumber;
use Illuminate\Foundation\Http\FormRequest;

/**
 * The document and revision a revision page shows, and the quote to highlight in it.
 */
final class RevisionPageRequest extends FormRequest
{
    use ReadsRouteNumber;

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return ['quote' => ['nullable', 'string', 'max:16384']];
    }

    public function documentNumber(): int
    {
        return $this->routeNumber('document');
    }

    public function revisionNumber(): int
    {
        return $this->routeNumber('revision');
    }

    /**
     * The quote to highlight, when the page was opened from an anchored comment.
     */
    public function quote(): string|null
    {
        return $this->filled('quote') ? $this->string('quote')->toString() : null;
    }
}
