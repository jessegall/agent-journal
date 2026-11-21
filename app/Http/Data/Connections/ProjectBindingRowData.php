<?php

declare(strict_types=1);

namespace App\Http\Data\Connections;

use App\Connections\Enums\BindingReadiness;
use App\Connections\Models\ProjectBinding;
use App\Drivers\Enums\HookDriver;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One connected folder as the owner sees it, read at one server time: its reference, the project and environment it
 * works in by label and id, the machine it is on, each program and whether Start is offered for it, when its relay
 * was last in contact and until when its presence holds, when the server took its revocation, where it stands now
 * with the words for that, its terminal sign-ins, and its support record of who did what to it and when. Its
 * canonical path is never shown.
 */
#[TypeScript]
final class ProjectBindingRowData extends Data
{
    /**
     * @param  list<BindingProviderData>  $capabilities
     * @param  list<TerminalSignInRowData>  $signIns
     * @param  list<SupportRecordRowData>  $supportRecord
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
        #[DataCollectionOf(BindingProviderData::class)]
        public readonly array $capabilities = [],
        public readonly string|null $presenceExpiresAt = null,
        public readonly string|null $revokedAt = null,
        public readonly string $stateText = '',
        #[DataCollectionOf(TerminalSignInRowData::class)]
        public readonly array $signIns = [],
        #[DataCollectionOf(SupportRecordRowData::class)]
        public readonly array $supportRecord = [],
    ) {}

    /**
     * @param  list<TerminalSignInRowData>  $signIns
     * @param  list<SupportRecordRowData>  $supportRecord
     */
    public static function fromBinding(
        ProjectBinding $binding,
        CarbonImmutable $serverTime,
        array $signIns = [],
        string $currentRelease = '',
        array $supportRecord = [],
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
            'environmentLabel' => $binding->environment->label ?? 'No environment',
            'capabilities' => self::providersOf($binding, $state),
            'presenceExpiresAt' => $binding->presence_expires_at?->toIso8601String(),
            'revokedAt' => $binding->revoked_at?->toIso8601String(),
            'stateText' => self::stateTextOf($binding, $state, $currentRelease)
                .($binding->isStopUnconfirmedAt($serverTime)
                    ? ' Session stop unconfirmed: its lease ended and the device has not confirmed it stopped.'
                    : ''),
            'signIns' => $signIns,
            'supportRecord' => $supportRecord,
        ]);
    }

    /**
     * Each program the folder could start, offered only when the binding may start it and the folder is ready with an
     * environment; otherwise the row shows its status alone, with the reason for each program.
     *
     * @return list<array<string, bool|string>>
     */
    private static function providersOf(ProjectBinding $binding, BindingReadiness $state): array
    {
        return array_map(function (HookDriver $driver) use ($binding, $state): array {
            $reason = $binding->eligibilityOf($driver)->unavailableReason;

            if ($reason === '' && $state !== BindingReadiness::Ready) {
                $reason = 'Start waits until the folder is ready.';
            }

            if ($reason === '' && ! $binding->isReconciled()) {
                $reason = "Start waits until the folder's relay has reported what became of its earlier sessions.";
            }

            if ($reason === '' && $binding->isEnvironmentUnassigned()) {
                $reason = 'Start waits until the folder works in an environment.';
            }

            return [
                'driver' => $driver->value,
                'label' => $driver->displayName(),
                'canStart' => $reason === '',
                'startCommand' => 'journal '.$driver->hostName(),
                'unavailableReason' => $reason,
            ];
        }, HookDriver::cases());
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
