<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use PhpParser\Node\Expr;
use PhpParser\Node\FunctionLike;
use PhpParser\Node\Identifier;
use PhpParser\Node\IntersectionType;
use PhpParser\Node\Name;
use PhpParser\Node\NullableType;
use PhpParser\Node\Param;
use PhpParser\Node\Stmt;
use PhpParser\Node\UnionType;
use PhpParser\Node\UseItem;
use PhpParser\NodeFinder;

/**
 * Every resolved name a file uses, found in one visit of its parsed statements.
 */
final class NameScan
{
    /**
     * @return list<NameUse>
     */
    public static function of(ParsedFile $file): array
    {
        return [...self::imports($file), ...self::groupImports($file), ...self::names($file)];
    }

    /**
     * @return list<NameUse>
     */
    private static function imports(ParsedFile $file): array
    {
        $uses = [];

        foreach (new NodeFinder()->findInstanceOf($file->statements, Stmt\Use_::class) as $import) {
            foreach ($import->uses as $item) {
                $uses[] = new NameUse($file->path, $item->getStartLine(), $item->name->toString(), NameType::forImportType($import->type));
            }
        }

        return $uses;
    }

    /**
     * @return list<NameUse>
     */
    private static function groupImports(ParsedFile $file): array
    {
        $uses = [];

        foreach (new NodeFinder()->findInstanceOf($file->statements, Stmt\GroupUse::class) as $group) {
            foreach ($group->uses as $item) {
                $type = $item->type === Stmt\Use_::TYPE_UNKNOWN ? $group->type : $item->type;
                $name = Name::concat($group->prefix, $item->name);

                $uses[] = new NameUse($file->path, $item->getStartLine(), $name->toString(), NameType::forImportType($type));
            }
        }

        return $uses;
    }

    /**
     * @return list<NameUse>
     */
    private static function names(ParsedFile $file): array
    {
        $uses = [];

        foreach (new NodeFinder()->findInstanceOf($file->statements, Name::class) as $name) {
            if (! self::isUse($name)) {
                continue;
            }

            $uses[] = new NameUse($file->path, $name->getStartLine(), $name->toString(), self::typeOf($name));
        }

        return $uses;
    }

    /**
     * Import lines are read whole by the import scans, and self, static and parent name no other class.
     */
    private static function isUse(Name $name): bool
    {
        $parent = $name->getAttribute('parent');

        if ($parent instanceof UseItem || $parent instanceof Stmt\GroupUse || $parent instanceof Stmt\Namespace_) {
            return false;
        }

        return ! $name->isSpecialClassName();
    }

    private static function typeOf(Name $name): NameType
    {
        $parent = $name->getAttribute('parent');

        return match (true) {
            $parent instanceof Expr\FuncCall => NameType::Function,
            $parent instanceof Expr\ConstFetch => NameType::Constant,
            $parent instanceof Expr\ClassConstFetch => self::classConstantType($parent),
            $parent instanceof Expr\StaticCall, $parent instanceof Expr\StaticPropertyFetch => NameType::StaticAccess,
            $parent instanceof Expr\New_ => NameType::Construction,
            $parent instanceof Stmt\Class_ => self::classStatementType($parent, $name),
            self::isType($parent, $name) => NameType::Type,
            default => NameType::Other,
        };
    }

    private static function classConstantType(Expr\ClassConstFetch $fetch): NameType
    {
        if ($fetch->name instanceof Identifier && $fetch->name->toLowerString() === 'class') {
            return NameType::ClassName;
        }

        return NameType::StaticAccess;
    }

    /**
     * The class an anonymous class extends is built where it is written: new class extends Message.
     */
    private static function classStatementType(Stmt\Class_ $class, Name $name): NameType
    {
        if ($class->isAnonymous() && $class->extends === $name) {
            return NameType::Construction;
        }

        return NameType::Other;
    }

    private static function isType(mixed $parent, Name $name): bool
    {
        return match (true) {
            $parent instanceof NullableType, $parent instanceof UnionType, $parent instanceof IntersectionType => true,
            $parent instanceof Param => $parent->type === $name,
            $parent instanceof FunctionLike => $parent->getReturnType() === $name,
            $parent instanceof Stmt\Property, $parent instanceof Stmt\ClassConst => $parent->type === $name,
            default => false,
        };
    }
}
