<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * Which inbox's history the History page shows, and from which older message on.
 */
final class HistoryRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'inbox' => ['nullable', 'string', 'ulid'],
            'older' => ['nullable', 'string', 'ulid'],
        ];
    }

    /**
     * @return Option<string>
     */
    public function chosenInbox(): Option
    {
        return $this->filled('inbox') ? Some::create($this->string('inbox')->lower()->toString()) : None::create();
    }

    public function olderCursor(): string|null
    {
        return $this->filled('older') ? $this->string('older')->lower()->toString() : null;
    }
}
