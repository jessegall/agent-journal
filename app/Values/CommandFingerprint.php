<?php

declare(strict_types=1);

namespace App\Values;

/**
 * The digest that binds a request id to one operation: the verb's arguments, what was piped into it, the binding and
 * the agent that asked. A request id asked again with another fingerprint is another operation.
 */
final readonly class CommandFingerprint
{
    /**
     * @param  list<string>  $argv
     */
    public static function of(array $argv, string $pipedInput, string $bindingId, string $agentId): string
    {
        return hash('sha256', json_encode([$argv, $pipedInput, $bindingId, $agentId], JSON_THROW_ON_ERROR));
    }
}
