<?php

declare(strict_types=1);

namespace App\Data\Profiles;

use App\Values\ObjectDefinition;
use App\Values\ObjectMember;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One object a script can read, with its boolean members and the read each one needs, and whether it is available.
 */
#[TypeScript]
final class ScriptObjectData extends Data
{
    /**
     * @param  array<string, string>  $members  member name => the read it needs
     */
    public function __construct(
        public readonly string $key,
        public readonly array $members,
        public readonly bool $available,
    ) {}

    public static function fromDefinition(ObjectDefinition $object, bool $available): self
    {
        return new self(
            $object->key,
            array_map(fn (ObjectMember $member) => $member->read->key, $object->members),
            $available,
        );
    }
}
