<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Requests;

use App\Support\RecordReference;
use Domain\Documents\Values\DraftTarget;
use Illuminate\Foundation\Http\FormRequest;

/**
 * A call about one draft: the document number, and for an edit or close the token and version the client holds.
 */
final class DraftRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'number' => ['required', 'string'],
            'token' => ['nullable', 'string'],
            'version' => ['nullable', 'integer', 'min:1'],
            'mode' => ['nullable', 'string', 'in:body,section,text,details'],
            'section' => ['nullable', 'string'],
            'body' => ['nullable', 'string'],
            'old' => ['nullable', 'string'],
            'new' => ['nullable', 'string'],
            'title' => ['nullable', 'string'],
            'abstract' => ['nullable', 'string'],
        ];
    }

    public function documentNumber(): int
    {
        return RecordReference::number($this->string('number')->toString());
    }

    public function target(): DraftTarget
    {
        return new DraftTarget(
            (string) $this->documentNumber(),
            $this->string('token')->toString(),
            $this->integer('version'),
        );
    }

    public function mode(): string
    {
        return $this->string('mode', 'body')->toString();
    }

    /**
     * The section to replace, by its number or its exact heading.
     */
    public function section(): string
    {
        return $this->string('section')->toString();
    }

    public function text(string $field): string
    {
        return $this->string($field)->toString();
    }
}
