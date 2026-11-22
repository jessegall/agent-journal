<?php

declare(strict_types=1);

namespace App\Values;

/**
 * What came of revoking one binding: Revoked now, or Already revoked, with the time the server first took the
 * revocation, in ISO 8601, the same for every revoke of it. The server's acknowledgement is that time; the device's
 * own comes later, if ever.
 */
final readonly class BindingOutcome
{
    public const string REVOKED = 'Revoked';

    public const string ALREADY_REVOKED = 'Already revoked';

    public function __construct(public string $id, public string $result, public string $revokedAt) {}
}
