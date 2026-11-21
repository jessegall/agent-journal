<?php

declare(strict_types=1);

namespace App\Docking\Cards;

use App\Docking\Cards\Contracts\DockPart;
use App\Docking\Exceptions\DockCardInvalid;

/**
 * A docked source as its owner composed it: an accessible name, the page it opens when the viewer may open one, and
 * one root part. A card past the node or byte budget is marked to show only its safe summary.
 */
final readonly class DockCard
{
    public const int NODE_LIMIT = 128;

    public const int BYTE_LIMIT = 32 * 1024;

    private function __construct(
        public string $accessibleName,
        public DockPart $root,
        public DockDestination|null $open,
        public bool $overBudget,
    ) {}

    /**
     * @throws DockCardInvalid
     */
    public static function named(string $accessibleName, DockPart $root, DockDestination|null $open = null): self
    {
        if (trim($accessibleName) === '') {
            throw DockCardInvalid::blankName();
        }

        $nodes = self::checkedNodeCount($root);

        return new self(
            $accessibleName,
            $root,
            $open,
            $nodes > self::NODE_LIMIT || strlen((string) json_encode($root)) > self::BYTE_LIMIT,
        );
    }

    /**
     * The parts under and including this one, refusing two siblings that share a key.
     */
    private static function checkedNodeCount(DockPart $part): int
    {
        $keys = [];
        $count = 1;

        foreach ($part->children() as $child) {
            if (isset($keys[$child->key()])) {
                throw DockCardInvalid::repeatedKey($child->key());
            }

            $keys[$child->key()] = true;
            $count += self::checkedNodeCount($child);
        }

        return $count;
    }
}
