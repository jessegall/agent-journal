<?php

declare(strict_types=1);

namespace Domain\Sharing\Tests\Support;

use App\Contracts\Sharing\ShareGateway;
use App\Support\GatewayConfiguration;
use App\Support\GatewayEndpoint;
use App\Support\GatewayHealth;
use App\Support\GatewayOperation;
use App\Support\GatewaySettings;
use App\Support\GatewaySetupCheck;
use Domain\Sharing\Exceptions\GatewayOpenFailed;

/**
 * A gateway for sharing lifecycle tests: it opens on its configuration's public origin with no process, remembers
 * every operation it opened and endpoint it closed, and can be told to refuse opening or to report itself unhealthy.
 */
final class FakeShareGateway implements ShareGateway
{
    public const string KEY = 'fake';

    public const string PUBLIC_ORIGIN = 'https://share.fake.test';

    /**
     * @var list<GatewayOperation>
     */
    public array $opened = [];

    /**
     * @var list<GatewayEndpoint>
     */
    public array $closed = [];

    private bool $refusesToOpen = false;

    /**
     * @var list<string>
     */
    private array $healthProblems = [];

    /**
     * Settings for a configuration of this gateway.
     */
    public static function settings(): GatewaySettings
    {
        return new GatewaySettings(self::KEY, '1.0.0', 'fake.test', self::PUBLIC_ORIGIN, 8100, []);
    }

    public function refuseToOpen(): void
    {
        $this->refusesToOpen = true;
    }

    public function becomeUnhealthy(string $problem): void
    {
        $this->healthProblems[] = $problem;
    }

    public function setupCheck(GatewayConfiguration $configuration): GatewaySetupCheck
    {
        return GatewaySetupCheck::passed();
    }

    public function open(GatewayOperation $operation): GatewayEndpoint
    {
        if ($this->refusesToOpen) {
            throw GatewayOpenFailed::notReady(self::KEY);
        }

        $this->opened[] = $operation;

        return GatewayEndpoint::forOperation($operation);
    }

    public function health(GatewayEndpoint $endpoint): GatewayHealth
    {
        return new GatewayHealth($this->healthProblems);
    }

    public function close(GatewayEndpoint $endpoint): void
    {
        $this->closed[] = $endpoint;
    }
}
