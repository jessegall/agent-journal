<?php

declare(strict_types=1);

namespace App\Processes\Stored;

use App\Processes\Values\RuleReference;
use Spatie\LaravelData\Data;

/**
 * One exact rule revision of one owner, as a stored project replacement names it.
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
