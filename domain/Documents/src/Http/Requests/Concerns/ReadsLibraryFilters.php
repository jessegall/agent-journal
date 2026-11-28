<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Requests\Concerns;

use App\Http\Requests\Concerns\ReadsOptionalText;
use Domain\Documents\Data\DocumentFilters;
use Domain\Documents\Enums\AttentionFilter;
use Domain\Documents\Enums\LibraryTypeFilter;
use Illuminate\Validation\Rule;

trait ReadsLibraryFilters
{
    use ReadsOptionalText;

    /** @return array<string, list<mixed>> */
    protected function libraryRules(): array
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
        return DocumentFilters::from([
            'attention' => $this->enum('attention', AttentionFilter::class) ?? AttentionFilter::Active,
            'page' => max(1, $this->integer('page', 1)),
            'query' => $this->optionalText('query'),
            'revisions' => $this->boolean('revisions'),
            'after' => $this->optionalText('after'),
        ]);
    }

    public function typeFilter(): LibraryTypeFilter
    {
        return $this->enum('type', LibraryTypeFilter::class) ?? LibraryTypeFilter::All;
    }
}
