<?php

declare(strict_types=1);

namespace App\Http\Requests\Comments;

use App\Http\Requests\RecordTargetRequest;
use App\Text\Support\TextSelection;

/**
 * Where one comment of a record points, with an optional span of lines to read instead of the default window.
 */
final class CommentLocationRequest extends RecordTargetRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            ...$this->targetRules(),
            'comment' => ['required', 'ulid'],
            'first_line' => ['nullable', 'integer', 'min:1', 'required_with:last_line'],
            'last_line' => ['nullable', 'integer', 'min:1', 'required_with:first_line'],
        ];
    }

    public function commentId(): string
    {
        return $this->string('comment')->toString();
    }

    public function selection(): TextSelection
    {
        return $this->filled('first_line') ? TextSelection::from([
            'firstLine' => $this->integer('first_line'),
            'lastLine' => $this->integer('last_line'),
        ]) : TextSelection::from([]);
    }
}
