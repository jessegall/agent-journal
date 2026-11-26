<?php

declare(strict_types=1);

namespace Domain\Sharing\Commands\DisableShareGateway;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Bus\Attributes\Commands\RequiresRequestKey;
use App\Sharing\GatewayConfiguration;
use App\Support\Command;
use Domain\Sharing\Policies\SharingPolicy;

/**
 * The owner takes a gateway configuration out of use: every share it serves is revoked first, then its endpoint is
 * asked to close. The provider's account and domain are never touched.
 *
 * @extends Command<GatewayConfiguration>
 */
#[Authorize(SharingPolicy::class, AccessType::Edit)]
#[RequiresRequestKey(retentionDays: 31, refusalDays: 365)]
final readonly class DisableShareGatewayCommand extends Command
{
    public function __construct(
        public string $configurationId,
        public string $requestKey,
    ) {}
}
