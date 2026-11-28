<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Requests;

use App\Support\RecordReference;
use App\Support\TextSelection;
use Illuminate\Foundation\Http\FormRequest;

/**
 * The number of the document or report to show, read through the one record number parser.
 */
final class ShowRecordRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'number' => [
                'required',
                'string',
            ],
            'selection' => [
                'nullable',
                'array',
            ],
            'selection.section' => [
                'nullable',
                'string',
            ],
            'selection.firstLine' => [
                'nullable',
                'integer',
                'min:1',
            ],
            'selection.lastLine' => [
                'nullable',
                'integer',
                'min:1',
            ],
            'selection.bullets' => [
                'nullable',
                'boolean',
            ],
            'selection.words' => [
                'nullable',
                'string',
            ],
            'selection.all' => [
                'nullable',
                'boolean',
            ],
            'revision' => [
                'nullable',
                'integer',
                'min:1',
            ],
            'at_revision' => [
                'nullable',
                'integer',
                'min:1',
            ],
            'page' => [
                'nullable',
                'integer',
                'min:1',
            ],
        ];
    }

    public function selection(): TextSelection
    {
        return TextSelection::from($this->array('selection'));
    }

    public function page(): int
    {
        return $this->integer('page', 1);
    }

    public function revision(): int|null
    {
        if ($this->filled('revision')) {
            return $this->integer('revision');
        }

        return null;
    }

    public function expectedRevision(): int|null
    {
        if ($this->filled('at_revision')) {
            return $this->integer('at_revision');
        }

        return null;
    }

    public function number(): int
    {
        return RecordReference::number($this->string('number')->toString());
    }
}
