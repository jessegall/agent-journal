<?php

declare(strict_types=1);

namespace App\Hosts;

use App\Exceptions\HostProtocolRefused;
use App\Hosts\Protocol\HostProtocol;
use App\Hosts\Protocol\Payloads\HostOpenPlanPayload;

/**
 * Host protocol 1's rules for a contained plan, as it crosses the wire: it names nothing of the host it runs on, no
 * refused field and no {host:NAME}, and carries its start grant whole or not at all.
 */
final readonly class ContainedPlanRules
{
    /**
     * @throws HostProtocolRefused
     */
    public function assertKept(HostOpenPlanPayload $plan): void
    {
        if ($plan->container === null) {
            return;
        }

        $wire = $plan->toArray();

        $named = array_values(array_filter(
            HostProtocol::CONTAINED_REFUSED_FIELDS,
            fn (string $field) => $wire[$field] !== [],
        ));

        if ($named !== []) {
            throw HostProtocolRefused::containedPlanNamesHost($named);
        }

        $hostNames = array_values(array_filter(
            HostProtocol::HOST_NAMES,
            fn (string $name) => str_contains((string) json_encode($wire), "{host:{$name}}"),
        ));

        if ($hostNames !== []) {
            $placeholders = array_map(fn (string $name) => "{host:{$name}}", $hostNames);

            throw HostProtocolRefused::containedPlanNamesHost($placeholders);
        }

        $missing = $this->missingGrantVariables($plan->environment);

        if ($missing !== []) {
            throw HostProtocolRefused::containedGrantPartial($missing);
        }
    }

    /**
     * The start grant variables the environment lacks while it carries others of them: none for a whole grant or none.
     *
     * @param  list<string>  $environment
     * @return list<string>
     */
    private function missingGrantVariables(array $environment): array
    {
        $carried = array_map(fn (string $entry) => explode('=', $entry, 2)[0], $environment);
        $missing = array_values(array_diff(HostProtocol::CONTAINED_START_GRANT_ENVIRONMENT, $carried));

        if (count($missing) === count(HostProtocol::CONTAINED_START_GRANT_ENVIRONMENT)) {
            return [];
        }

        return $missing;
    }
}
