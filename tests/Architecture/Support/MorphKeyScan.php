<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use PhpParser\Node\Attribute;
use PhpParser\Node\Expr\Variable;
use PhpParser\Node\Param;
use PhpParser\Node\Scalar\String_;
use PhpParser\Node\Stmt\Class_;
use PhpParser\Node\Stmt\ClassConst;
use PhpParser\Node\Stmt\Property;
use PhpParser\NodeFinder;
use Spatie\LaravelData\Attributes\PropertyForMorph;
use Spatie\LaravelData\Contracts\PropertyMorphableData;

/**
 * Finds each morphed Data class whose MORPHED_BY constant names no #[PropertyForMorph] property of the class, so the
 * key morph() reads its properties by cannot go stale when the property is renamed.
 */
final class MorphKeyScan
{
    /**
     * The constant that names the property a class is morphed by.
     */
    public const string KEY_CONSTANT = 'MORPHED_BY';

    /**
     * @return list<string>
     */
    public static function findingsIn(ParsedFile $file): array
    {
        $findings = [];

        foreach (new NodeFinder()->findInstanceOf($file->statements, Class_::class) as $class) {
            if (! self::isMorphable($class)) {
                continue;
            }

            $key = self::keyOf($class);
            $morphedBy = self::morphProperties($class);

            if ($key !== null && ! in_array($key, $morphedBy, true)) {
                $name = $class->namespacedName?->toString() ?? $file->path;
                $findings[] = "{$name}::".self::KEY_CONSTANT." names {$key}, which is no #[PropertyForMorph] property";
            }
        }

        return $findings;
    }

    private static function isMorphable(Class_ $class): bool
    {
        foreach ($class->implements as $interface) {
            if ($interface->toString() === PropertyMorphableData::class) {
                return true;
            }
        }

        return false;
    }

    private static function keyOf(Class_ $class): string|null
    {
        foreach ($class->getConstants() as $constants) {
            foreach (self::constantsNamedKey($constants) as $value) {
                return $value;
            }
        }

        return null;
    }

    /**
     * @return list<string>
     */
    private static function constantsNamedKey(ClassConst $constants): array
    {
        $values = [];

        foreach ($constants->consts as $constant) {
            if ($constant->name->toString() === self::KEY_CONSTANT && $constant->value instanceof String_) {
                $values[] = $constant->value->value;
            }
        }

        return $values;
    }

    /**
     * The names of the class's properties marked #[PropertyForMorph], declared or promoted.
     *
     * @return list<string>
     */
    private static function morphProperties(Class_ $class): array
    {
        $names = [];

        foreach ($class->getProperties() as $property) {
            if (self::isMarked($property)) {
                array_push($names, ...array_map(fn ($item) => $item->name->toString(), $property->props));
            }
        }

        foreach ($class->getMethod('__construct')?->params ?? [] as $parameter) {
            if (self::isMarked($parameter) && $parameter->var instanceof Variable) {
                $names[] = (string) $parameter->var->name;
            }
        }

        return $names;
    }

    private static function isMarked(Property|Param $node): bool
    {
        foreach ($node->attrGroups as $group) {
            $marks = array_filter(
                $group->attrs,
                fn (Attribute $attribute) => $attribute->name->toString() === PropertyForMorph::class,
            );

            if ($marks !== []) {
                return true;
            }
        }

        return false;
    }
}
