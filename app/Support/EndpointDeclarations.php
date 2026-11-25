<?php

declare(strict_types=1);

namespace App\Support;

use App\Attributes\Api\Endpoint;
use App\Contracts\Domains\ApiPayload;
use App\Exceptions\EndpointDeclarationInvalid;

/**
 * Checks each signed call's declaration: it is a ApiPayload with one #[Endpoint], and a keyed write, and only a keyed
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
        $declaration = Reflector::of($call);

        if (! $declaration->implements(ApiPayload::class)) {
            throw EndpointDeclarationInvalid::for($call, 'it does not implement ApiPayload');
        }

        $declared = $declaration->attributes(Endpoint::class);

        if (count($declared) !== 1) {
            throw EndpointDeclarationInvalid::for($call, 'it needs exactly one #[Endpoint]');
        }

        $endpoint = $declared->first()->get();
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
