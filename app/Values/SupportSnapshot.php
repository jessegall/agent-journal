<?php

declare(strict_types=1);

namespace App\Values;

use App\Agents\Drivers\Enums\DriverCapability;
use App\Exceptions\DriverCapabilityUnsupported;

/**
 * What a driver can do on one bound host, operation by operation; an operation it names nothing for is unsupported.
 */
final readonly class SupportSnapshot
{
    public const string NOT_REPORTED = 'The driver does not report this operation.';

    /**
     * @param  array<value-of<DriverCapability>, OperationSupport>  $capabilities
     */
    public function __construct(public array $capabilities) {}

    /**
     * Every operation allowed but those named, which each carry the support given.
     *
     * @param  list<array{DriverCapability, OperationSupport}>  $exceptions
     */
    public static function allowingAllBut(array $exceptions): self
    {
        $capabilities = [];

        foreach (DriverCapability::cases() as $capability) {
            $capabilities[$capability->value] = $capability->defaultSupport();
        }

        foreach ($exceptions as [$capability, $support]) {
            $capabilities[$capability->value] = $support;
        }

        return new self($capabilities);
    }

    /**
     * Whether the driver allows the operation now.
     */
    public function allows(DriverCapability $capability): bool
    {
        return $this->supportOf($capability)->isAllowed();
    }

    public function supportOf(DriverCapability $capability): OperationSupport
    {
        return $this->capabilities[$capability->value] ?? OperationSupport::unsupported(self::NOT_REPORTED);
    }

    /**
     * Refuses the first required operation the driver cannot do now, naming its reason.
     *
     * @param  list<DriverCapability>  $required
     *
     * @throws DriverCapabilityUnsupported
     */
    public function assertSupports(array $required): void
    {
        foreach ($required as $capability) {
            $support = $this->supportOf($capability);

            if (! $support->isAllowed()) {
                throw DriverCapabilityUnsupported::for($capability, (string) $support->reason);
            }
        }
    }
}
