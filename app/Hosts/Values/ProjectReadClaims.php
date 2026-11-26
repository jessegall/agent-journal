<?php

declare(strict_types=1);

namespace App\Hosts\Values;

use App\Projects\Values\ProjectReadClaim;

/**
 * The reads of its projects one host poll handed out, oldest first.
 */
final readonly class ProjectReadClaims
{
    /**
     * @param  list<ProjectReadClaim>  $claims
     */
    public function __construct(public array $claims) {}

    public function isEmpty(): bool
    {
        return $this->claims === [];
    }
}
