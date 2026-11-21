<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

/**
 * Where the object a model method calls on comes from, as far as its own code shows.
 */
enum ReceiverOrigin
{
    case Own;
    case NewRow;
    case OwnQuery;
    case Relation;
    case Property;
    case OwnClass;
    case OtherClass;
    case OtherQuery;
    case Unknown;

    /**
     * Whether a write on it stays on the model's own row, or on the new row its static constructor makes.
     */
    public function isOwnRow(): bool
    {
        return $this === self::Own || $this === self::NewRow;
    }

    /**
     * Whether a call on it is a query builder step of its own class or on the object itself.
     */
    public function isOwnSide(): bool
    {
        return $this->isOwnRow() || $this === self::OwnQuery || $this === self::Relation;
    }

    /**
     * Whether it is a query or a relation, whose further steps answer the same kind of rows.
     */
    public function isQuery(): bool
    {
        return $this === self::OwnQuery || $this === self::OtherQuery || $this === self::Relation;
    }

    /**
     * The origin of the row a query of this origin answers.
     */
    public function rowOfQuery(): self
    {
        return match ($this) {
            self::OwnQuery => self::OwnClass,
            self::OtherQuery => self::OtherClass,
            default => self::Unknown,
        };
    }
}
