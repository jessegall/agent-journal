<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Profiles\Exceptions\ProfileProposalRefused;
use ValueError;

/**
 * One access type on one resource area, as a proposal names it: delete:workspace.
 */
final readonly class ClassRule
{
    public function __construct(
        public AccessType $access,
        public ResourceAreaType $area,
    ) {}

    /**
     * @throws ProfileProposalRefused
     */
    public static function parse(string $text): self
    {
        $parts = explode(':', $text);

        try {
            return count($parts) === 2
                ? new self(AccessType::from($parts[0]), ResourceAreaType::from($parts[1]))
                : throw ProfileProposalRefused::classRule($text);
        } catch (ValueError) {
            throw ProfileProposalRefused::classRule($text);
        }
    }

    public function isSameAs(self $other): bool
    {
        return $this->access === $other->access && $this->area === $other->area;
    }
}
