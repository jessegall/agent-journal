<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use PhpParser\Node\Stmt\ClassLike;
use PhpParser\Node\Stmt\Enum_;
use PhpParser\NodeFinder;
use Tests\Support\ScanCache\FileScan;

/**
 * The classes, interfaces, traits and enums a file declares, by full name, each marked whether it is an enum.
 *
 * @implements FileScan<array{name: string, enum: bool}>
 */
final readonly class TypesDeclared implements FileScan
{
    public function key(): string
    {
        return 'types-declared-1';
    }

    public function findingsIn(ParsedFile $file): array
    {
        $types = [];

        foreach ((new NodeFinder)->findInstanceOf($file->statements, ClassLike::class) as $type) {
            $name = $type->namespacedName?->toString();

            if ($name !== null) {
                $types[] = ['name' => $name, 'enum' => $type instanceof Enum_];
            }
        }

        return $types;
    }
}
