<?php

declare(strict_types=1);

namespace App\Sharing\Commands;

use App\Actors\Enums\ActorType;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Attributes\RequiresRequestKey;
use App\Bus\Contracts\Command;
use App\Sharing\Handlers\ConfigureShareGatewayHandler;
use App\Sharing\Support\GatewayConfiguration;

/**
 * The owner writes a gateway's next settings revision: its pinned program version, provider host, fixed public
 * origin, listener port and the names of the secrets it reads, never their bytes; and may make it the default once it
 * is ready. Shares made earlier keep the revision they pinned.
 *
 * @implements Command<GatewayConfiguration>
 */
#[HandledBy(ConfigureShareGatewayHandler::class)]
#[RequiresActor(ActorType::User)]
#[RequiresRequestKey(retentionDays: 31, tombstoneDays: 365)]
final readonly class ConfigureShareGateway implements Command
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
