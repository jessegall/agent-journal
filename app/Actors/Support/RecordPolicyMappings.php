<?php

declare(strict_types=1);

namespace App\Actors\Support;

use App\Actors\Contracts\PolicyCatalogue;
use App\Actors\Exceptions\PolicyRegistrationConflict;
use App\Actors\Values\PolicyRegistration;
use Illuminate\Contracts\Auth\Access\Gate;

/**
 * Checks, once every provider has booted, that Laravel's Gate resolves each registered record policy for exactly its
 * model: the journal writes no mapping, so the model's UsePolicy or the conventional name must lead there.
 */
final readonly class RecordPolicyMappings
{
    public function __construct(private Gate $gate, private PolicyCatalogue $policies) {}

    /**
     * @throws PolicyRegistrationConflict
     */
    public function assertResolved(): void
    {
        $records = array_filter(
            $this->policies->registrations(),
            fn (PolicyRegistration $registration) => $registration->isRecord(),
        );

        foreach ($records as $registration) {
            $resolved = $this->gate->getPolicyFor($registration->model());
            $resolvedClass = $resolved === null ? 'no policy' : $resolved::class;

            if ($resolvedClass !== $registration->policy) {
                throw PolicyRegistrationConflict::forGate(
                    $registration->model(),
                    $registration->policy,
                    $resolvedClass,
                );
            }
        }
    }
}
