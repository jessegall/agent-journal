<?php

declare(strict_types=1);

namespace App\Http\Requests\Communication;

use App\Communication\Data\MessagePage;
use Illuminate\Foundation\Http\FormRequest;

final class InboxHistoryRequest extends FormRequest
{
    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'inboxId' => ['required', 'string', 'size:26'],
            'olderCursor' => ['sometimes', 'nullable', 'string', 'size:26'],
            'limit' => ['sometimes', 'integer', 'min:1', 'max:100'],
        ];
    }

    public function inboxId(): string
    {
        return $this->string('inboxId')->toString();
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
