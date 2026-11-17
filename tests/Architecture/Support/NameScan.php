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

        foreach ((new NodeFinder)->findInstanceOf($file->statements, Stmt\Use_::class) as $import) {
            foreach ($import->uses as $item) {
                $uses[] = new NameUse($file->path, $item->getStartLine(), $item->name->toString(), NameKind::forImportType($import->type));
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

        foreach ((new NodeFinder)->findInstanceOf($file->statements, Stmt\GroupUse::class) as $group) {
            foreach ($group->uses as $item) {
                $type = $item->type === Stmt\Use_::TYPE_UNKNOWN ? $group->type : $item->type;
                $name = Name::concat($group->prefix, $item->name);

                $uses[] = new NameUse($file->path, $item->getStartLine(), $name->toString(), NameKind::forImportType($type));
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

        foreach ((new NodeFinder)->findInstanceOf($file->statements, Name::class) as $name) {
            if (! self::isUse($name)) {
                continue;
            }

            $uses[] = new NameUse($file->path, $name->getStartLine(), $name->toString(), self::kindOf($name));
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

    private static function kindOf(Name $name): NameKind
    {
        $parent = $name->getAttribute('parent');

        return match (true) {
            $parent instanceof Expr\FuncCall => NameKind::Function,
            $parent instanceof Expr\ConstFetch => NameKind::Constant,
            $parent instanceof Expr\ClassConstFetch => self::classConstantKind($parent),
            $parent instanceof Expr\StaticCall, $parent instanceof Expr\StaticPropertyFetch => NameKind::StaticAccess,
            $parent instanceof Expr\New_ => NameKind::Construction,
            $parent instanceof Stmt\Class_ => self::classStatementKind($parent, $name),
            self::isType($parent, $name) => NameKind::Type,
            default => NameKind::Other,
        };
    }

    private static function classConstantKind(Expr\ClassConstFetch $fetch): NameKind
    {
        if ($fetch->name instanceof Identifier && $fetch->name->toLowerString() === 'class') {
            return NameKind::ClassName;
        }

        return NameKind::StaticAccess;
    }

    /**
     * The class an anonymous class extends is built where it is written: new class extends Message.
     */
    private static function classStatementKind(Stmt\Class_ $class, Name $name): NameKind
    {
        if ($class->isAnonymous() && $class->extends === $name) {
            return NameKind::Construction;
        }

        return NameKind::Other;
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
