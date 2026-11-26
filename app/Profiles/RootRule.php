<?php

declare(strict_types=1);

namespace App\Profiles;

use App\Agents\Enums\AccessType;
use App\Profiles\Enums\ResourceType;
use App\Profiles\Exceptions\ProfileProposalRefused;
use App\Values\AccessPolicy;
use App\Values\ResourceRequest;
use ValueError;

/**
 * One access on one root path, as a proposal names it: delete:. for the working folder, edit:.scratch below it.
 */
final readonly class RootRule
{
    public function __construct(
        public AccessType $access,
        public string $root,
    ) {}

    /**
     * @throws ProfileProposalRefused
     */
    public static function parse(string $text): self
    {
        $parts = explode(':', $text, 2);

        try {
            if (count($parts) === 2 && $parts[1] !== '') {
                return new self(AccessType::from($parts[0]), $parts[1]);
            }

            throw ProfileProposalRefused::rootRule($text);
        } catch (ValueError $cause) {
            throw ProfileProposalRefused::rootRule($text, previous: $cause);
        }
    }

    public function isSameAs(self $other): bool
    {
        return $this->access === $other->access && $this->root === $other->root;
    }

    /**
     * Whether the root is a file no profile may touch.
     */
    public function isProtected(): bool
    {
        $root = new ResourceRequest(ResourceType::Path, $this->root)->normalizedPath();

        return array_any(
            AccessPolicy::PROTECTED_PATHS,
            fn (string $protected) => $root === $protected || str_ends_with($root, '/'.$protected),
        );
    }
}
