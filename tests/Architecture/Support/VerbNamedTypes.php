<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use PhpParser\Node\Stmt\Class_;
use PhpParser\Node\Stmt\ClassLike;
use PhpParser\Node\Stmt\Enum_;
use PhpParser\Node\Stmt\Interface_;
use PhpParser\NodeFinder;
use Tests\Support\ScanCache\FileScan;

/**
 * The classes, interfaces and enums a file declares whose name opens with a verb about what the implementer does
 * (RunsPipelines, ProvidesPages), by full name. A type is named with a noun for what it is or the role it plays
 * (rule 43); a trait or an attribute class may say what the class using it does, so neither is read.
 *
 * @implements FileScan<string>
 */
final readonly class VerbNamedTypes implements FileScan
{
    /**
     * Third-person verbs a type name has opened with; a plural noun or an area name such as Reads is never one.
     */
    public const array VERBS = [
        'Accepts', 'Admits', 'Allows', 'Answers', 'Applies', 'Asks', 'Authorizes', 'Binds', 'Boots', 'Builds', 'Can',
        'Carries', 'Changes', 'Checks', 'Collects', 'Converts', 'Counts', 'Creates', 'Declares', 'Defines', 'Delivers',
        'Describes', 'Dispatches', 'Emits', 'Enforces', 'Exports', 'Exposes', 'Finds', 'Follows', 'Forwards', 'Gives',
        'Grants', 'Guards', 'Handles', 'Has', 'Holds', 'Inspects', 'Is', 'Keeps', 'Lets', 'Limits', 'Lists', 'Loads',
        'Locks', 'Logs', 'Makes', 'Maps', 'Marks', 'Needs', 'Notifies', 'Offers', 'Opens', 'Owns', 'Parses', 'Passes',
        'Prepares', 'Produces', 'Provides', 'Publishes', 'Receives', 'Registers', 'Remembers', 'Renders', 'Reports',
        'Requires', 'Resolves', 'Returns', 'Runs', 'Sends', 'Serves', 'Shows', 'Signs', 'Starts', 'Stops', 'Stores',
        'Supplies', 'Supports', 'Takes', 'Tells', 'Tracks', 'Updates', 'Uses', 'Validates', 'Verifies', 'Wakes',
        'Watches', 'Wraps', 'Writes',
    ];

    public function key(): string
    {
        return 'verb-named-types-1';
    }

    public function findingsIn(ParsedFile $file): array
    {
        $named = array_filter(
            new NodeFinder()->findInstanceOf($file->statements, ClassLike::class),
            fn (ClassLike $type): bool => self::isJudged($type) && self::isVerbPhrase((string) $type->name),
        );

        return array_values(array_map(
            fn (ClassLike $type): string => $type->namespacedName?->toString() ?? (string) $type->name,
            $named,
        ));
    }

    /**
     * Whether the name is a verb phrase: its first word is a verb and more words follow it.
     */
    public static function isVerbPhrase(string $name): bool
    {
        return preg_match('/^([A-Z][a-z]+)[A-Z]/', $name, $first) === 1 && in_array($first[1], self::VERBS, true);
    }

    /**
     * Whether the type is a class, interface or enum the rule judges: a trait and an attribute class are not.
     */
    private static function isJudged(ClassLike $type): bool
    {
        return ($type instanceof Class_ && ! self::isAttribute($type))
            || $type instanceof Interface_
            || $type instanceof Enum_;
    }

    private static function isAttribute(Class_ $class): bool
    {
        foreach ($class->attrGroups as $group) {
            foreach ($group->attrs as $attribute) {
                if ($attribute->name->getLast() === 'Attribute') {
                    return true;
                }
            }
        }

        return false;
    }
}
