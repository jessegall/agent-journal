<?php

declare(strict_types=1);

namespace App\Sharing\Commands;

use App\Actors\Enums\ActorType;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Attributes\RequiresRequestKey;
use App\Bus\Contracts\Command;
use App\Sharing\Handlers\DisableShareGatewayHandler;
use App\Sharing\Support\GatewayConfiguration;

/**
 * The owner takes a gateway configuration out of use: every share it serves is revoked first, then its endpoint is
 * asked to close. The provider's account and domain are never touched.
 *
 * @implements Command<GatewayConfiguration>
 */
#[HandledBy(DisableShareGatewayHandler::class)]
#[RequiresActor(ActorType::User)]
#[RequiresRequestKey(retentionDays: 31, tombstoneDays: 365)]
final readonly class DisableShareGateway implements Command
{
    public function __construct(
        public string $configurationId,
        public string $requestKey,
    ) {}
}
