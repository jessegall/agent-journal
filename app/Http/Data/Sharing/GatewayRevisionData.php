<?php

declare(strict_types=1);

namespace App\Http\Data\Sharing;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One gateway settings revision on the owner's gateway page: its settings and the names of its secrets (never their
 * values), whether it is the default or disabled, why it is not ready, whether its endpoint answers, and the shares
 * disabling it would revoke.
 */
#[TypeScript]
final class GatewayRevisionData extends Data
{
    /**
     * @param  list<string>  $secretReferences
     * @param  list<string>  $readinessProblems
     * @param  list<RootShareData>  $dependentShares
     */
    public function __construct(
        public readonly string $id,
        public readonly string $gatewayKey,
        public readonly int $version,
        public readonly string $executableVersion,
        public readonly string $providerHost,
        public readonly string $publicOrigin,
        public readonly int $listenerPort,
        public readonly array $secretReferences,
        public readonly bool $isDefault,
        public readonly bool $isDisabled,
        public readonly array $readinessProblems,
        public readonly bool|null $isHealthy,
        #[DataCollectionOf(RootShareData::class)]
        public readonly array $dependentShares,
    ) {}
}
