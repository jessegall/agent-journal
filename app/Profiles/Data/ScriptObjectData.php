<?php

declare(strict_types=1);

namespace App\Profiles\Data;

use App\Profiles\Values\ObjectMember;
use App\Values\ObjectDefinition;
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
        public readonly bool $isAvailable,
    ) {}

    public static function fromDefinition(ObjectDefinition $object, bool $isAvailable): self
    {
        return new self(
            $object->key,
            array_map(fn (ObjectMember $member) => $member->read->key, $object->members),
            $isAvailable,
        );
    }
}
