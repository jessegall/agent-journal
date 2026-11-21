<?php

declare(strict_types=1);

namespace App\Agents\Values;

/**
 * What a version 2 workspace sample adds to the version 1 facts: the binding and checkout it was read for and the
 * full verified HEAD object id, or the typed reason there is none (an unborn or unavailable root). A version 1 sample
 * carries none of it and never authorizes commit-based dispatch.
 */
final readonly class CommitObservation
{
    public const string UNBORN = 'unborn';

    public const string UNAVAILABLE = 'unavailable';

    private function __construct(
        public int $version,
        public string $bindingId,
        public string $checkoutId,
        public string $headOid,
        public string $reason,
    ) {}

    public static function versionOne(): self
    {
        return new self(1, '', '', '', '');
    }

    public static function ofHead(string $bindingId, string $checkoutId, string $oid): self
    {
        return new self(2, $bindingId, $checkoutId, $oid, '');
    }

    public static function without(string $bindingId, string $checkoutId, string $reason): self
    {
        return new self(2, $bindingId, $checkoutId, '', $reason);
    }

    /**
     * Whether the sample names a verified commit a commit-based dispatch may start from.
     */
    public function authorizesCommitDispatch(): bool
    {
        return $this->version === 2 && $this->headOid !== '';
    }
}
