<?php

declare(strict_types=1);

namespace App\Http\Requests\Text;

use App\Http\Requests\RecordTargetRequest;
use App\Text\Support\TextSelection;

/**
 * A bounded read of one version of a record's text: a span of lines, or one section by its number or heading.
 */
final class ReadTextRequest extends RecordTargetRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            ...$this->targetRules(),
            'version' => ['required', 'string', 'max:64'],
            'section' => ['nullable', 'string', 'max:200', 'prohibits:first_line,last_line'],
            'first_line' => ['nullable', 'integer', 'min:1'],
            'last_line' => ['nullable', 'integer', 'min:1', 'gte:first_line'],
            'all' => ['prohibited'],
            'bullets' => ['prohibited'],
            'grep' => ['prohibited'],
        ];
    }

    public function version(): string
    {
        return $this->string('version')->toString();
    }

    public function selection(): TextSelection
    {
        if ($this->filled('section')) {
            return new TextSelection(section: $this->string('section')->toString());
        }

        return new TextSelection(
            firstLine: $this->filled('first_line') ? $this->integer('first_line') : 1,
            lastLine: $this->filled('last_line') ? $this->integer('last_line') : null,
        );
    }
}
