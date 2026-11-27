<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Requests;

use Domain\Documents\Data\DocumentFilters;
use Domain\Documents\Enums\AttentionFilter;
use Domain\Documents\Enums\LibraryTypeFilter;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Which page of documents or reports to list, by attention and by words in their text.
 */
final class ListRecordsRequest extends FormRequest
{
    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'attention' => ['nullable', Rule::enum(AttentionFilter::class)],
            'page' => ['nullable', 'integer', 'min:1'],
            'query' => ['nullable', 'string', 'max:200'],
            'revisions' => ['nullable', 'boolean'],
            'after' => ['nullable', 'string', 'ulid'],
            'type' => ['nullable', Rule::enum(LibraryTypeFilter::class)],
        ];
    }

    public function filters(): DocumentFilters
    {
        return new DocumentFilters(
            attention: $this->enum('attention', AttentionFilter::class) ?? AttentionFilter::Active,
            page: $this->integer('page', 1),
            query: $this->optionalText('query'),
            revisions: $this->boolean('revisions'),
            after: $this->optionalText('after'),
        );
    }

    /**
     * The text given for the key, none when it was left out or empty.
     */
    private function optionalText(string $key): string|null
    {
        if (! $this->filled($key)) {
            return null;
        }

        return $this->string($key)->toString();
    }

    /**
     * Which records the library lists; none lists documents and reports.
     */
    public function typeFilter(): LibraryTypeFilter
    {
        return $this->enum('type', LibraryTypeFilter::class) ?? LibraryTypeFilter::All;
    }
}
