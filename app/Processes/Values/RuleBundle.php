<?php

declare(strict_types=1);

namespace App\Processes\Values;

/**
 * The rules one installed module declares at one version: they wait for the owner's review as one bundle, and a changed
 * rule changes the bundle's digest, so it waits again.
 */
final readonly class RuleBundle
{
    /**
     * @param  list<CommandRule>  $rules
     */
    public function __construct(public string $module, public string $version, public array $rules) {}

    public function digest(): string
    {
        $rules = array_map(fn (CommandRule $rule): array => $rule->toArray(), $this->rules);

        return hash('sha256', json_encode($rules, JSON_THROW_ON_ERROR));
    }
}
