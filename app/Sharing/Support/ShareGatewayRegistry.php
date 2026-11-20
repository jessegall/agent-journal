<?php

declare(strict_types=1);

namespace App\Sharing\Support;

use App\Sharing\Contracts\ShareGateway;
use App\Sharing\Exceptions\ShareGatewayInvalid;
use App\Sharing\Exceptions\UnknownShareGateway;
use App\Sharing\Models\ShareGatewayConfiguration;
use App\Sharing\Models\ShareGatewayEndpoint;
use Illuminate\Contracts\Container\Container;

/**
 * Every share gateway by its key, such as tunler, from Core and the domains. It keeps class names only and builds a
 * gateway when one is asked for.
 */
final class ShareGatewayRegistry
{
    /**
     * @var array<string, class-string<ShareGateway>>
     */
    private array $gatewayClasses = [];

    public function __construct(private readonly Container $container) {}

    /**
     * @param  class-string<ShareGateway>  $class
     *
     * @throws ShareGatewayInvalid
     */
    public function register(string $key, string $class): void
    {
        if (array_key_exists($key, $this->gatewayClasses)) {
            throw ShareGatewayInvalid::repeated($key);
        }

        if (! is_subclass_of($class, ShareGateway::class)) {
            throw ShareGatewayInvalid::notAGateway($key, $class);
        }

        $this->gatewayClasses[$key] = $class;
    }

    public function has(string $key): bool
    {
        return array_key_exists($key, $this->gatewayClasses);
    }

    /**
     * @throws UnknownShareGateway
     */
    public function get(string $key): ShareGateway
    {
        if (! $this->has($key)) {
            throw UnknownShareGateway::forKey($key);
        }

        return $this->container->make($this->gatewayClasses[$key]);
    }

    /**
     * What the configuration's gateway says is missing before it can open; a read only.
     *
     * @throws UnknownShareGateway
     */
    public function setupCheckOf(ShareGatewayConfiguration $configuration): GatewaySetupCheck
    {
        return $this->get($configuration->gateway_key)->setupCheck($configuration->toConfiguration());
    }

    /**
     * Why the revision's gateway is not ready; none for a disabled revision or one whose gateway is not registered,
     * since neither is asked.
     *
     * @return list<string>
     */
    public function setupProblemsOf(ShareGatewayConfiguration $configuration): array
    {
        if ($configuration->isDisabled() || ! $this->has($configuration->gateway_key)) {
            return [];
        }

        return $this->setupCheckOf($configuration)->problems;
    }

    /**
     * The gateway that carries out the claimed operation.
     *
     * @throws UnknownShareGateway
     */
    public function forOperation(GatewayOperation $operation): ShareGateway
    {
        return $this->get($operation->settings()->gatewayKey);
    }

    /**
     * Whether the open endpoint still answers, asked of the gateway that opened it.
     *
     * @throws UnknownShareGateway
     */
    public function healthOf(ShareGatewayEndpoint $endpoint): GatewayHealth
    {
        return $this->get($endpoint->gatewayKey())->health($endpoint->toGatewayEndpoint());
    }

    /**
     * @return list<string>
     */
    public function keys(): array
    {
        return array_keys($this->gatewayClasses);
    }
}
