<?php

declare(strict_types=1);

namespace App\AgentRequests\Support;

use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Exceptions\EndpointDeclarationInvalid;
use ReflectionClass;

/**
 * Checks each signed call's declaration: it is a JournalCall with one #[Endpoint], and a keyed write, and only a keyed
 * write, names who keeps its receipt.
 */
final class EndpointDeclarations
{
    /**
     * @param  list<class-string>  $calls
     *
     * @throws EndpointDeclarationInvalid
     */
    public static function check(array $calls): void
    {
        foreach ($calls as $call) {
            self::endpointOf($call);
        }
    }

    /**
     * @param  class-string  $call
     *
     * @throws EndpointDeclarationInvalid
     */
    public static function endpointOf(string $call): Endpoint
    {
        $class = new ReflectionClass($call);

        if (! $class->implementsInterface(JournalCall::class)) {
            throw EndpointDeclarationInvalid::for($call, 'it does not implement JournalCall');
        }

        $declared = $class->getAttributes(Endpoint::class);

        if (count($declared) !== 1) {
            throw EndpointDeclarationInvalid::for($call, 'it needs exactly one #[Endpoint]');
        }

        $endpoint = $declared[0]->newInstance();
        $namesReceipt = $endpoint->receipt !== null;

        if ($endpoint->effect->needsReceipt() !== $namesReceipt) {
            $problem = $namesReceipt
                ? 'only a keyed write names who keeps its receipt'
                : 'a keyed write names who keeps its receipt';

            throw EndpointDeclarationInvalid::for($call, $problem);
        }

        return $endpoint;
    }
}
