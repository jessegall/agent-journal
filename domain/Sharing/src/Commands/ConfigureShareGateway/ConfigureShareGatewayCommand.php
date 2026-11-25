<?php

declare(strict_types=1);

namespace Domain\Sharing\Commands\ConfigureShareGateway;

use App\Attributes\Commands\Authorize;
use App\Attributes\Commands\RequiresRequestKey;
use App\Enums\Agents\AccessType;
use App\Support\Command;
use App\Support\GatewayConfiguration;
use Domain\Sharing\Policies\SharingPolicy;

/**
 * The owner writes a gateway's next settings revision: its pinned program version, provider host, fixed public
 * origin, listener port and the names of the secrets it reads, never their bytes; and may make it the default once it
 * is ready. Shares made earlier keep the revision they pinned.
 *
 * @extends Command<GatewayConfiguration>
 */
#[Authorize(SharingPolicy::class, AccessType::Create)]
#[RequiresRequestKey(retentionDays: 31, refusalDays: 365)]
final readonly class ConfigureShareGatewayCommand extends Command
{
    /**
     * @param  list<string>  $secretReferences
     */
    public function __construct(
        public string $gatewayKey,
        public string $executableVersion,
        public string $providerHost,
        public string $publicOrigin,
        public int $listenerPort,
        public array $secretReferences,
        public bool $makesDefault,
        public string $requestKey,
    ) {}
}
