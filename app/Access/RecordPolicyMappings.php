<?php

declare(strict_types=1);

namespace App\Access;

use App\Access\Contracts\PolicyCatalogue;
use App\Access\Exceptions\PolicyDefinitionConflict;
use App\Access\Values\PolicyDefinition;
use Illuminate\Contracts\Auth\Access\Gate;

/**
 * Checks, once every provider has booted, that Laravel's Gate resolves each registered record policy for exactly its
 * model: the journal writes no mapping, so the model's UsePolicy or the conventional name must lead there.
 */
final readonly class RecordPolicyMappings
{
    public function __construct(private Gate $gate, private PolicyCatalogue $policies) {}

    /**
     * @throws PolicyDefinitionConflict
     */
    public function assertResolved(): void
    {
        $records = array_filter(
            $this->policies->definitions(),
            fn (PolicyDefinition $definition) => $definition->isRecord(),
        );

        foreach ($records as $definition) {
            $resolved = $this->gate->getPolicyFor($definition->model());
            $resolvedClass = $resolved === null ? 'no policy' : $resolved::class;

            if ($resolvedClass !== $definition->policy) {
                throw PolicyDefinitionConflict::forGate(
                    $definition->model(),
                    $definition->policy,
                    $resolvedClass,
                );
            }
        }
    }
}
