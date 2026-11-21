<?php

declare(strict_types=1);

namespace App\Connections\Values;

/**
 * What came of revoking one chosen binding: Revoked, or Already revoked.
 */
final readonly class BindingOutcome
{
    public function __construct(public string $id, public string $result) {}
}
