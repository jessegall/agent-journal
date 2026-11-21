<?php

declare(strict_types=1);

namespace App\Http\Data\Connections;

use App\Connections\Enums\BindingReadiness;
use App\Connections\Models\ProjectBinding;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One connected folder as the owner sees it: the machine and project it is labelled with, when its relay was last in
 * contact, where it stands now and its terminal sign-ins. Its canonical path is never shown.
 */
#[TypeScript]
final class ProjectBindingRowData extends Data
{
    /**
     * @param  list<TerminalSignInRowData>  $signIns
     */
    public function __construct(
        public readonly string $id,
        public readonly string $machineLabel,
        public readonly string $projectLabel,
        public readonly string|null $lastContactAt,
        public readonly BindingReadiness $state,
        #[DataCollectionOf(TerminalSignInRowData::class)]
        public readonly array $signIns = [],
    ) {}

    /**
     * @param  list<TerminalSignInRowData>  $signIns
     */
    public static function fromBinding(ProjectBinding $binding, CarbonImmutable $serverTime, array $signIns = []): self
    {
        return self::from([
            'id' => $binding->id,
            'machineLabel' => $binding->machine_label,
            'projectLabel' => $binding->project_label,
            'lastContactAt' => $binding->last_contact_at?->toIso8601String(),
            'state' => $binding->readinessAt($serverTime),
            'signIns' => $signIns,
        ]);
    }
}
