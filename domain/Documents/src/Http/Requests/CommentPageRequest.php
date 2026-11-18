<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Requests;

use App\Http\Requests\Web\Concerns\ReadsRouteNumber;
use Domain\Documents\Support\CommentAnchor;
use Illuminate\Foundation\Http\FormRequest;

/**
 * A comment a user posts from a record page: its text, and for a quote the revision and where the quote sits.
 */
final class CommentPageRequest extends FormRequest
{
    use ReadsRouteNumber;

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'body' => ['required', 'string'],
            'revision' => ['nullable', 'integer', 'min:1', 'required_with:quote'],
            'quote' => ['nullable', 'string'],
            'first_line' => ['nullable', 'integer', 'min:1', 'required_with:quote'],
            'last_line' => ['nullable', 'integer', 'min:1', 'required_with:quote'],
            'start_offset' => ['nullable', 'integer', 'min:0', 'required_with:quote'],
            'end_offset' => ['nullable', 'integer', 'min:0', 'required_with:quote'],
        ];
    }

    public function documentNumber(): int
    {
        return $this->routeNumber('document');
    }

    public function reportNumber(): int
    {
        return $this->routeNumber('report');
    }

    public function body(): string
    {
        return (string) $this->input('body', '');
    }

    public function anchor(): CommentAnchor|null
    {
        if (! $this->filled('quote')) {
            return null;
        }

        return new CommentAnchor(
            $this->integer('revision'),
            (string) $this->input('quote'),
            $this->integer('first_line'),
            $this->integer('last_line'),
            $this->integer('start_offset'),
            $this->integer('end_offset'),
        );
    }
}
