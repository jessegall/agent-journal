<?php

declare(strict_types=1);

namespace Tests\Fixtures\Actors;

use App\Contracts\CurrentAuthorizer;
use App\Exceptions\ActorNotAllowed;
use App\Enums\AccessType;

/**
 * The caller's authorizer fixed for a test: the caller is granted the listed accesses and nothing else.
 */
final readonly class FixedCurrentAuthorizer implements CurrentAuthorizer
{
    /**
     * @param  list<AccessType>  $granted
     */
    public function __construct(private array $granted = []) {}

    public function authorize(string $policy, object|string $subject, AccessType $access): void
    {
        if (! in_array($access, $this->granted, true)) {
            throw ActorNotAllowed::to($access, is_string($subject) ? $subject : $subject::class);
        }
    }

    public function filterActions(string $policy, object|string $subject, array $accesses): array
    {
        return array_values(array_filter(
            $accesses,
            fn (AccessType $access) => in_array($access, $this->granted, true),
        ));
    }
}
