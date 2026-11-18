<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Requests;

use App\Numbers\Support\RecordReference;
use Illuminate\Foundation\Http\FormRequest;

/**
 * A card to dock, hide or show again: the record's type and number, and the session.
 */
final class DockRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'type' => ['required', 'string', 'in:doc,report'],
            'number' => ['required', 'string'],
            'session' => ['required', 'string', 'ulid'],
        ];
    }

    public function isReport(): bool
    {
        return $this->string('type')->toString() === 'report';
    }

    public function number(): int
    {
        return RecordReference::number($this->string('number')->toString());
    }

    public function sessionId(): string
    {
        return $this->string('session')->toString();
    }
}
