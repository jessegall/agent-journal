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
 * One connected folder as the owner sees it, read at one server time: its reference, the project and environment it
 * works in by label and id, the machine it is on, the providers that machine can start, when its relay was last in
 * contact and until when its presence holds, where it stands now with the words for that, and its terminal sign-ins.
 * Its canonical path is never shown.
 */
#[TypeScript]
final class ProjectBindingRowData extends Data
{
    /**
     * @param  list<TerminalSignInRowData>  $signIns
     */
    /**
     * @param  list<string>  $capabilities
     * @param  list<TerminalSignInRowData>  $signIns
     */
    public function __construct(
        public readonly string $id,
        public readonly string $machineLabel,
        public readonly string $projectLabel,
        public readonly string|null $lastContactAt,
        public readonly BindingReadiness $state,
        public readonly string $projectId = '',
        public readonly string|null $environmentId = null,
        public readonly string $environmentLabel = '',
        public readonly array $capabilities = [],
        public readonly string|null $presenceExpiresAt = null,
        public readonly string $stateText = '',
        #[DataCollectionOf(TerminalSignInRowData::class)]
        public readonly array $signIns = [],
    ) {}

    /**
     * @param  list<TerminalSignInRowData>  $signIns
     */
    public static function fromBinding(
        ProjectBinding $binding,
        CarbonImmutable $serverTime,
        array $signIns = [],
        string $currentRelease = '',
    ): self {
        $state = $binding->readinessAt($serverTime);

        return self::from([
            'id' => $binding->id,
            'machineLabel' => $binding->machine_label,
            'projectLabel' => $binding->project_label,
            'lastContactAt' => $binding->last_contact_at?->toIso8601String(),
            'state' => $state,
            'projectId' => $binding->project_id,
            'environmentId' => $binding->environment_id,
            'environmentLabel' => $binding->environment?->label ?? 'No environment',
            'capabilities' => [],
            'presenceExpiresAt' => $binding->presence_expires_at?->toIso8601String(),
            'stateText' => self::stateTextOf($binding, $state, $currentRelease),
            'signIns' => $signIns,
        ]);
    }

    /**
     * What the row says of where the folder stands, and what the owner can do about it.
     */
    private static function stateTextOf(ProjectBinding $binding, BindingReadiness $state, string $currentRelease): string
    {
        if ($state !== BindingReadiness::Revoked && $binding->isEnvironmentUnassigned()) {
            return 'Environment unassigned: assign one of its project\'s environments before it starts anything.';
        }

        return match ($state) {
            BindingReadiness::Pending => $binding->last_contact_at === null
                ? 'Waiting for first contact.'
                : 'Waiting for setup to finish.',
            BindingReadiness::Ready => 'Ready.',
            BindingReadiness::Offline => 'Offline. Run journal status in the folder to start its relay again.',
            BindingReadiness::Incompatible => "Needs an update to release {$currentRelease}: run journal upgrade in the folder.",
            BindingReadiness::Revoked => 'Revoked. Copy a new install line to connect the folder again.',
        };
    }
}
