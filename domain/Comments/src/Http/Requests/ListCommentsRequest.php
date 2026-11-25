<?php

declare(strict_types=1);

namespace Domain\Comments\Http\Requests;

use App\Http\Requests\RecordTargetRequest;
use App\Support\IdListPage;
use App\Values\PageSize;

/**
 * A page of one record's comments, after a comment id when reading on.
 */
final class ListCommentsRequest extends RecordTargetRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'target' => $this->targetRules(),
            'after' => ['nullable', 'ulid'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:'.IdListPage::LARGEST_LIMIT],
        ];
    }

    public function page(): IdListPage
    {
        return new IdListPage(
            $this->filled('after') ? $this->string('after')->lower()->toString() : null,
            PageSize::from($this->filled('per_page') ? $this->integer('per_page') : null)->rows,
        );
    }
}
