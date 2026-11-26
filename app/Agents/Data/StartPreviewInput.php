<?php

declare(strict_types=1);

namespace App\Agents\Data;

use App\Agents\Drivers\Enums\DriverType;
use App\Values\ModelSelection;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * What the start form asks a preview of for an agent: the family chosen, the driver type named or none to inherit,
 * and the model, its default when none is named.
 */
#[TypeScript]
final class StartPreviewInput extends Data
{
    public function __construct(
        public readonly string $agent,
        public readonly string|null $family = null,
        public readonly DriverType|null $driverType = null,
        public readonly string|null $model = null,
    ) {}

    /**
     * @return array<string, list<string>>
     */
    public static function rules(): array
    {
        return [
            'agent' => [
                'required',
                'string',
                'max:64',
            ],
            'family' => [
                'nullable',
                'string',
                'max:32',
            ],
            'model' => [
                'nullable',
                'string',
                'max:100',
            ],
        ];
    }

    public function modelSelection(): ModelSelection
    {
        return ModelSelection::fromInput($this->model ?? 'default');
    }
}
