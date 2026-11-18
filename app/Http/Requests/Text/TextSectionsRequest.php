<?php

declare(strict_types=1);

namespace App\Http\Requests\Text;

use App\Http\Requests\RecordTargetRequest;
use App\Reads\Values\PageSize;

/**
 * A page of the sections of one version of a record's text, after a section number.
 */
final class TextSectionsRequest extends RecordTargetRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            ...$this->targetRules(),
            'version' => ['required', 'string', 'max:64'],
            'after_section' => ['nullable', 'integer', 'min:0'],
            'per_page' => ['nullable', 'integer', 'min:1'],
        ];
    }

    public function version(): string
    {
        return $this->string('version')->toString();
    }

    public function afterSection(): int
    {
        return $this->integer('after_section');
    }

    public function pageSize(): PageSize
    {
        return PageSize::from($this->filled('per_page') ? $this->integer('per_page') : null);
    }
}
