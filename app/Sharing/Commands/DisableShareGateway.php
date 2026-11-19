<?php

declare(strict_types=1);

namespace App\Sharing\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresRequestKey;
use App\Bus\Support\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Sharing\Enums\SharingAbility;
use App\Sharing\Handlers\DisableShareGatewayHandler;
use App\Sharing\Models\Share;
use App\Sharing\Policies\SharingPolicy;
use App\Sharing\Support\GatewayConfiguration;

/**
 * The owner takes a gateway configuration out of use: every share it serves is revoked first, then its endpoint is
 * asked to close. The provider's account and domain are never touched.
 *
 * @extends Command<GatewayConfiguration>
 */
#[HandledBy(DisableShareGatewayHandler::class)]
#[Authorize(SharingPolicy::class, SharingAbility::Administer)]
#[RequiresRequestKey(retentionDays: 31, tombstoneDays: 365)]
final readonly class DisableShareGateway extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public string $configurationId,
        public string $requestKey,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Share::class;
    }
}
