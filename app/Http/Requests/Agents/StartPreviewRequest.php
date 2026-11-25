<?php

declare(strict_types=1);

namespace App\Http\Requests\Agents;

use App\Enums\Drivers\DriverType;
use App\Values\ModelSelection;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * What the start form asks a preview of: the family chosen, the driver type named or none to inherit, and the model.
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
            'driverType' => ['nullable', Rule::enum(DriverType::class)],
            'model' => ['nullable', 'string', 'max:100'],
        ];
    }

    public function family(): string|null
    {
        if ($this->filled('family')) {
            return $this->string('family')->toString();
        }

        return null;
    }

    public function driverType(): DriverType|null
    {
        return $this->enum('driverType', DriverType::class);
    }

    public function model(): ModelSelection
    {
        return ModelSelection::fromInput($this->filled('model') ? $this->string('model')->toString() : 'default');
    }
}
