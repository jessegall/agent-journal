<?php

declare(strict_types=1);

namespace App\Http\Data\Connections;

use App\Connections\Enums\BindingReadiness;
use App\Connections\Models\ProjectBinding;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One connected folder as the owner sees it: the machine and project it is labelled with, when its relay was last in
 * contact and where it stands now. Its canonical path is never shown.
 */
#[TypeScript]
final class ProjectBindingRowData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $machineLabel,
        public readonly string $projectLabel,
        public readonly string|null $lastContactAt,
        public readonly BindingReadiness $state,
    ) {}

    public static function fromBinding(ProjectBinding $binding, CarbonImmutable $serverTime): self
    {
        return new self(
            $binding->id,
            $binding->machine_label,
            $binding->project_label,
            $binding->last_contact_at?->toIso8601String(),
            $binding->readinessAt($serverTime),
        );
    }
}
