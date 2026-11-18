<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Requests;

use Domain\Documents\Data\DocumentFilters;
use Domain\Documents\Enums\AttentionFilter;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Which page of documents or reports to list, by attention.
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
        ];
    }

    public function filters(): DocumentFilters
    {
        return new DocumentFilters(
            attention: $this->enum('attention', AttentionFilter::class) ?? AttentionFilter::Active,
            page: $this->integer('page', 1),
        );
    }
}
