<?php

declare(strict_types=1);

namespace App\Support\Stored;

use App\Values\RuleReference;
use Spatie\LaravelData\Data;

/**
 * One exact rule revision of one owner, as a stored project replacement names it.
 *
 * @method static array<int, static> collect(mixed $items) read only from decoded JSON, so always an array
 */
final class StoredRuleReference extends Data
{
    public function __construct(
        public readonly StoredRuleScope $scope,
        public readonly string $id,
        public readonly int $revision,
    ) {}

    public static function fromReference(RuleReference $reference): self
    {
        return self::from([
            'scope' => StoredRuleScope::fromRuleScope($reference->scope),
            'id' => $reference->id,
            'revision' => $reference->revision,
        ]);
    }

    public function toReference(): RuleReference
    {
        return new RuleReference($this->scope->toRuleScope(), $this->id, $this->revision);
    }
}
