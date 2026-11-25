<?php

declare(strict_types=1);

namespace Domain\Sharing\Commands\DisableShareGateway;

use App\Attributes\Commands\Authorize;
use App\Attributes\Commands\RequiresRequestKey;
use App\Enums\Agents\AccessType;
use App\Support\Command;
use App\Support\GatewayConfiguration;
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
