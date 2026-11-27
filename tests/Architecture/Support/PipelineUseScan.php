<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use PhpParser\Node;
use PhpParser\Node\Expr;
use PhpParser\Node\Stmt;
use PhpParser\NodeFinder;
use Tests\Support\ScanCache\FileScan;

/**
 * Where pipelines are named, read from the syntax tree: "<pipeline> steps <class>" for each class a pipeline's pipes()
 * names, and "<file class> names <class>" for each class named anywhere else, so a pipeline run directly is told
 * apart from one that is only another pipeline's step.
 *
 * @implements FileScan<string>
 */
final readonly class PipelineUseScan implements FileScan
{
    private const string DEFINITION = 'App\\Bus\\Contracts\\PipelineDefinition';

    public function key(): string
    {
        return 'pipeline-uses-1';
    }

    public function findingsIn(ParsedFile $file): array
    {
        $finder = new NodeFinder();
        $findings = [];

        foreach ($finder->findInstanceOf($file->statements, Stmt\ClassLike::class) as $class) {
            $name = (string) $class->namespacedName?->toString();
            $implements = $class instanceof Stmt\Class_ ? $class->implements : [];
            $isPipeline = array_any(
                $implements,
                fn (Node\Name $interface) => $interface->toString() === self::DEFINITION,
            );

            foreach ($class->getMethods() as $method) {
                $verb = $isPipeline && $method->name->toString() === 'pipes' ? 'steps' : 'names';

                foreach (self::namedClasses($finder, $method->stmts ?? []) as $named) {
                    $findings[] = "{$name} {$verb} {$named}";
                }
            }

            if ($isPipeline) {
                $findings[] = "{$name} is a pipeline";
            }
        }

        return array_values(array_unique($findings));
    }

    /**
     * @param  array<Node>  $statements
     * @return list<string>
     */
    private static function namedClasses(NodeFinder $finder, array $statements): array
    {
        $named = [];

        foreach ($finder->findInstanceOf($statements, Expr\ClassConstFetch::class) as $fetch) {
            $isClassName = $fetch->name instanceof Node\Identifier && $fetch->name->toString() === 'class';

            if ($fetch->class instanceof Node\Name && $isClassName) {
                $named[] = $fetch->class->toString();
            }
        }

        return $named;
    }
}
