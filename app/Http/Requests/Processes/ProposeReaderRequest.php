<?php

declare(strict_types=1);

namespace App\Http\Requests\Processes;

use App\Processes\Enums\RecordRole;
use App\Processes\Exceptions\ReaderDefinitionInvalid;
use App\Processes\Values\ReaderDefinition;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * A reader proposed for a request's declaration revision: the definition is checked field by field here and becomes
 * its typed value, never an untyped array inside Core.
 */
final class ProposeReaderRequest extends FormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'declaration_revision' => ['required', 'integer', 'min:1'],
            'definition' => ['required', 'array'],
            'definition.rules' => ['required', 'array', 'list', 'min:1'],
            'definition.rules.*.role' => ['required', Rule::enum(RecordRole::class)],
            'definition.rules.*.pattern' => ['required', 'string', 'max:2000'],
            'definition.count_fields' => ['present', 'array', 'list'],
            'definition.count_fields.*' => ['string'],
            'definition.total_field' => ['present', 'nullable', 'string'],
            'definition.failure_field' => ['present', 'nullable', 'string'],
            'definition.max_record_bytes' => ['required', 'integer', 'min:1'],
            'definition.millisecond_budget' => ['required', 'integer', 'min:1'],
        ];
    }

    public function declarationRevision(): int
    {
        return $this->integer('declaration_revision');
    }

    /**
     * @throws ReaderDefinitionInvalid
     */
    public function definition(): ReaderDefinition
    {
        /** @var array<string, mixed> $definition */
        $definition = $this->validated('definition');

        return ReaderDefinition::fromArray($definition);
    }
}
