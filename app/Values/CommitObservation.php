<?php

declare(strict_types=1);

namespace App\Values;

/**
 * What a workspace sample of a connected folder adds to its git facts: the binding and checkout it was read for and
 * the full verified HEAD object id, or the typed reason there is none (an unborn or unavailable root). A plain
 * sample names no binding, carries none of it and never authorizes commit-based dispatch.
 */
final readonly class CommitObservation
{
    public const string UNBORN = 'unborn';

    public const string UNAVAILABLE = 'unavailable';

    private function __construct(
        public string $bindingId,
        public string $checkoutId,
        public string $headOid,
        public string $reason,
    ) {}

    public static function notRecorded(): self
    {
        return new self('', '', '', '');
    }

    public static function ofHead(string $bindingId, string $checkoutId, string $oid): self
    {
        return new self($bindingId, $checkoutId, $oid, '');
    }

    public static function withoutCommit(string $bindingId, string $checkoutId, string $reason): self
    {
        return new self($bindingId, $checkoutId, '', $reason);
    }

    /**
     * Whether the sample was read for a binding's checkout, so it carries a commit or the reason it has none.
     */
    public function isRecorded(): bool
    {
        return $this->bindingId !== '';
    }

    /**
     * Whether the sample names a verified commit a commit-based dispatch may start from.
     */
    public function authorizesCommitDispatch(): bool
    {
        return $this->isRecorded() && $this->headOid !== '';
    }
}
