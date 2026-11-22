<?php

declare(strict_types=1);

namespace App\Support;

/**
 * Who a public assignment asked for and who holds the work as a result.
 */
final readonly class AssignmentRequest
{
    public function __construct(
        public AssigneeIdentity $requested,
        public AssigneeIdentity $resolved,
    ) {}
}
