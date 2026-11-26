<?php

declare(strict_types=1);

namespace App\Support;

use App\Sharing\Enums\ShareRelationType;
use App\Sharing\ShareRelation;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

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

    /**
     * The relation of this name, or none when the type declares no such relation.
     *
     * @return Option<ShareRelation>
     */
    public function find(string $name): Option
    {
        foreach ($this->relations as $relation) {
            if ($relation->name === $name) {
                return Some::create($relation);
            }
        }

        return None::create();
    }

    /**
     * The capabilities a record must advertise to be reached through one of the linked relations.
     *
     * @return list<string>
     */
    public function linkedCapabilities(): array
    {
        $linked = array_filter(
            $this->relations,
            fn (ShareRelation $relation) => $relation->type === ShareRelationType::Linked,
        );

        return array_values(array_unique(array_map(fn (ShareRelation $relation) => $relation->capability, $linked)));
    }
}
