<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use PhpParser\Node;
use PhpParser\Node\Expr;
use PhpParser\NodeFinder;
use Tests\Support\ScanCache\FileScan;

/**
 * Each place a file names a private place of the file funnel, such as Place::Accounts, with its line and the case.
 *
 * @implements FileScan<array{line: int, place: string}>
 */
final readonly class PrivatePlaceScan implements FileScan
{
    /**
     * The private places, by case name.
     */
    private const array PRIVATE_PLACES = ['Accounts', 'SharingSecrets', 'SharingTunnels', 'HookRuntime'];

    private const string PLACE = 'App\Enums\Place';

    public function key(): string
    {
        return 'private-places-1';
    }

    public function findingsIn(ParsedFile $file): array
    {
        $findings = [];

        foreach (new NodeFinder()->findInstanceOf($file->statements, Expr\ClassConstFetch::class) as $fetch) {
            if (! $fetch->class instanceof Node\Name || ! $fetch->name instanceof Node\Identifier) {
                continue;
            }

            $case = $fetch->name->toString();

            if ($fetch->class->toString() === self::PLACE && in_array($case, self::PRIVATE_PLACES, true)) {
                $findings[] = ['line' => $fetch->getStartLine(), 'place' => $case];
            }
        }

        return $findings;
    }
}
