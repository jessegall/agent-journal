<?php

declare(strict_types=1);

namespace App\Commands\DisableShareGateway;

use App\Attributes\Authorize;
use App\Attributes\RequiresRequestKey;
use App\Enums\AccessType;
use App\Policies\SharingPolicy;
use App\Support\Command;
use App\Support\GatewayConfiguration;

/**
 * The owner takes a gateway configuration out of use: every share it serves is revoked first, then its endpoint is
 * asked to close. The provider's account and domain are never touched.
 *
 * @extends Command<GatewayConfiguration>
 */
#[Authorize(SharingPolicy::class, AccessType::Edit)]
#[RequiresRequestKey(retentionDays: 31, tombstoneDays: 365)]
final readonly class DisableShareGatewayCommand extends Command
{
    public function __construct(
        public string $configurationId,
        public string $requestKey,
    ) {}
}
