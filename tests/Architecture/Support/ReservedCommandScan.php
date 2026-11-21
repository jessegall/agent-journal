<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use PhpParser\Node;
use PhpParser\Node\Stmt;
use PhpParser\NodeFinder;
use Tests\Support\ScanCache\FileScan;

/**
 * Where a file names a reserved instruction command, with the line, the command and whether the file declares a state.
 *
 * @implements FileScan<string>
 */
final readonly class ReservedCommandScan implements FileScan
{
    /**
     * The commands only the engine runs, for the frame its origin names.
     */
    public const array RESERVED = [
        'App\\Hooks\\Commands\\FocusInstruction',
        'App\\Hooks\\Commands\\ReleaseInstruction',
        'App\\Hooks\\Commands\\RefreshPlanInstruction',
    ];

    public function key(): string
    {
        return 'reserved-commands-1';
    }

    public function findingsIn(ParsedFile $file): array
    {
        $finder = new NodeFinder();
        $declaresState = $finder->findFirst(
            $file->statements,
            fn (Node $node) => $node instanceof Stmt\Class_ && $node->extends?->toString() === StateEffectScan::STATE,
        ) !== null;
        $findings = [];

        foreach ($finder->find($file->statements, fn (Node $node) => self::namesReserved($node)) as $name) {
            /** @var Node\Name $name */
            $findings[] = sprintf('%d %s %s', $name->getStartLine(), $declaresState ? 'state' : 'other', $name->toString());
        }

        return $findings;
    }

    private static function namesReserved(Node $node): bool
    {
        return $node instanceof Node\Name && in_array($node->toString(), self::RESERVED, true)
            && ! $node->getAttribute('parent') instanceof Node\UseItem;
    }
}
