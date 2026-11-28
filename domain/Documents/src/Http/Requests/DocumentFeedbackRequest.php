<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Requests;

use App\Http\Requests\Web\Concerns\ReadsRouteNumber;
use Illuminate\Foundation\Http\FormRequest;

/**
 * A reader asking an agent for feedback on a document: the agent, the request key the post is kept under, and the
 * lines asked about when the reader chose some; without lines the whole document is asked about.
 */
final class DocumentFeedbackRequest extends FormRequest
{
    use ReadsRouteNumber;

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'agent' => [
                'required',
                'ulid',
            ],
            'first_line' => [
                'required_with:last_line',
                'integer',
                'min:1',
            ],
            'last_line' => [
                'required_with:first_line',
                'integer',
                'gte:first_line',
            ],
        ];
    }

    public function documentNumber(): int
    {
        return $this->routeNumber('document');
    }

    public function agentId(): string
    {
        return $this->string('agent')->toString();
    }

    /**
     * What the feedback is asked on, in the words of the chat message.
     */
    public function subject(): string
    {
        $document = "doc {$this->documentNumber()}";

        if (! $this->filled('first_line')) {
            return $document;
        }

        $first = $this->integer('first_line');
        $last = $this->integer('last_line');
        $lines = $first === $last ? "line {$first}" : "lines {$first}-{$last}";

        return "{$lines} of {$document}";
    }
}
