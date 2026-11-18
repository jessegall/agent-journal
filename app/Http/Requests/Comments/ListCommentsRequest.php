<?php

declare(strict_types=1);

namespace App\Http\Requests\Comments;

use App\Assignments\Support\Page;
use App\Http\Requests\RecordTargetRequest;
use App\Reads\Values\PageSize;

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
            ...$this->targetRules(),
            'after' => ['nullable', 'ulid'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:'.Page::LARGEST_LIMIT],
        ];
    }

    public function page(): Page
    {
        return new Page($this->filled('after') ? $this->string('after')->toString() : null, PageSize::from($this->filled('per_page') ? $this->integer('per_page') : null)->rows);
    }
}
