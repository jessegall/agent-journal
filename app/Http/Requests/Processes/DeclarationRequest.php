<?php

declare(strict_types=1);

namespace App\Http\Requests\Processes;

use Illuminate\Foundation\Http\FormRequest;

/**
 * A declaration sent to propose or revise: its fields are read into typed values by RuleDeclarations, which answers
 * every wrong field at once.
 */
final class DeclarationRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'declaration' => ['required', 'array'],
            'expected_revision' => ['nullable', 'integer', 'min:1'],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function declaration(): array
    {
        /** @var array<string, mixed> $declaration */
        $declaration = $this->validated('declaration');

        return $declaration;
    }

    public function expectedRevision(): int
    {
        return $this->integer('expected_revision');
    }
}
