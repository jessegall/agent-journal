<?php

declare(strict_types=1);

namespace App\Sharing\Data;

use App\Models\Sharing\ShareGatewayConfiguration;
use App\Sharing\Support\ShareGatewayRegistry;
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
     * @param  list<string>  $setupProblems
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
        public readonly array $setupProblems,
        public readonly bool|null $isHealthy,
        #[DataCollectionOf(RootShareData::class)]
        public readonly array $dependentShares,
    ) {}

    /**
     * The revision as the owner sees it, its setup check asked of its gateway in the registry.
     */
    public static function fromConfiguration(
        ShareGatewayConfiguration $configuration,
        ShareGatewayRegistry $gateways,
    ): self {
        $settings = $configuration->settings;

        return new self(
            $configuration->id,
            $configuration->gateway_key,
            $configuration->configuration_version,
            $settings->executableVersion,
            $settings->providerHost,
            $settings->publicOrigin,
            $settings->listenerPort,
            $settings->secretReferences,
            $configuration->is_default,
            $configuration->isDisabled(),
            $gateways->setupProblemsOf($configuration),
            $configuration->endpointHealth(),
            array_map(RootShareData::fromShare(...), $configuration->unendedShares()),
        );
    }
}
