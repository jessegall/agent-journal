<?php

declare(strict_types=1);

namespace App\Http\Requests\Communication;

use App\Data\MessagePage;
use Illuminate\Foundation\Http\FormRequest;

final class MessagesBetweenRequest extends FormRequest
{
    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'firstInboxId' => ['required', 'string', 'size:26'],
            'secondInboxId' => ['required', 'string', 'size:26'],
            'olderCursor' => ['sometimes', 'nullable', 'string', 'size:26'],
            'limit' => ['sometimes', 'integer', 'min:1', 'max:100'],
        ];
    }

    public function firstInboxId(): string
    {
        return $this->string('firstInboxId')->toString();
    }

    public function secondInboxId(): string
    {
        return $this->string('secondInboxId')->toString();
    }

    public function olderCursor(): string|null
    {
        return $this->filled('olderCursor') ? $this->string('olderCursor')->toString() : null;
    }

    public function limit(): int
    {
        return $this->integer('limit', MessagePage::DEFAULT_LIMIT);
    }
}
