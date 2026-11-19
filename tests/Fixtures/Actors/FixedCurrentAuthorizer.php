<?php

declare(strict_types=1);

namespace Tests\Fixtures\Actors;

use App\Actors\Contracts\CurrentAuthorizer;
use App\Actors\Exceptions\ActorNotAllowed;
use BackedEnum;

/**
 * The caller's authorizer fixed for a test: the caller is granted the listed abilities and nothing else.
 */
final readonly class FixedCurrentAuthorizer implements CurrentAuthorizer
{
    /**
     * @param  list<BackedEnum>  $granted
     */
    public function __construct(private array $granted = []) {}

    public function authorize(string $policy, object|string $subject, BackedEnum $ability): void
    {
        if (! in_array($ability, $this->granted, true)) {
            throw ActorNotAllowed::to($ability, is_string($subject) ? $subject : $subject::class);
        }
    }

    public function filterActions(string $policy, object|string $subject, array $abilities): array
    {
        return array_values(array_filter(
            $abilities,
            fn (BackedEnum $ability) => in_array($ability, $this->granted, true),
        ));
    }
}
