<?php

declare(strict_types=1);

namespace App\Sharing\Support;

use App\Sharing\Enums\ShareRelationType;

/**
 * The fixed relations of one shareable record type, read once at boot.
 */
final readonly class ShareRelationSet
{
    /**
     * @param  list<ShareRelation>  $relations
     */
    public function __construct(public array $relations) {}

    /**
     * A record type that reaches no other record, such as a comment.
     */
    public static function none(): self
    {
        return new self([]);
    }

    /**
     * Owned children its own provider reads, such as the comments of a document.
     */
    public static function owned(string $name, string $capability): self
    {
        return new self([new ShareRelation($name, ShareRelationType::Owned, $capability)]);
    }

    /**
     * Linked records the owner approves one by one, such as the documents a plan links to.
     */
    public static function linked(string $name, string $capability): self
    {
        return new self([new ShareRelation($name, ShareRelationType::Linked, $capability)]);
    }

    /**
     * This set with the relations of another added after its own.
     */
    public function with(self $other): self
    {
        return new self([...$this->relations, ...$other->relations]);
    }
}
