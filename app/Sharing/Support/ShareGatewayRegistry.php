<?php

declare(strict_types=1);

namespace App\Sharing\Support;

use App\Sharing\Contracts\ShareGateway;
use App\Sharing\Exceptions\ShareGatewayInvalid;
use App\Sharing\Exceptions\UnknownShareGateway;
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
     * @param  class-string<ShareGateway>  $gatewayClass
     *
     * @throws ShareGatewayInvalid
     */
    public function register(string $key, string $gatewayClass): void
    {
        if (array_key_exists($key, $this->gatewayClasses)) {
            throw ShareGatewayInvalid::repeated($key);
        }

        if (! is_subclass_of($gatewayClass, ShareGateway::class)) {
            throw ShareGatewayInvalid::notAGateway($key, $gatewayClass);
        }

        $this->gatewayClasses[$key] = $gatewayClass;
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
        return $this->container->make($this->gatewayClasses[$key] ?? throw UnknownShareGateway::forKey($key));
    }

    /**
     * @return list<string>
     */
    public function keys(): array
    {
        return array_keys($this->gatewayClasses);
    }
}
