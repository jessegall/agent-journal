<?php

declare(strict_types=1);

namespace App\Http\Requests\Agents;

use App\Enums\DriverVariant;
use App\Values\ModelSelection;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * What the start form asks a preview of: the family chosen, the mode named or none to inherit, and the model.
 */
final class StartPreviewRequest extends FormRequest
{
    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'family' => ['nullable', 'string', 'max:32'],
            'mode' => ['nullable', Rule::enum(DriverVariant::class)],
            'model' => ['nullable', 'string', 'max:100'],
        ];
    }

    public function family(): string|null
    {
        return $this->filled('family') ? $this->string('family')->toString() : null;
    }

    public function mode(): DriverVariant|null
    {
        return $this->enum('mode', DriverVariant::class);
    }

    public function model(): ModelSelection
    {
        return ModelSelection::fromInput($this->filled('model') ? $this->string('model')->toString() : 'default');
    }
}
