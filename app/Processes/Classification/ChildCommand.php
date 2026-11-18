<?php

declare(strict_types=1);

namespace App\Processes\Classification;

use App\Processes\Enums\CommandType;
use App\Processes\Values\ClassFact;
use App\Processes\Values\PartClassification;
use App\Processes\Values\ProgramIdentity;
use App\Processes\Values\UnresolvedFact;

/**
 * Joins what a wrapper does by itself with what its child command does, on the wrapper's node: the facts and
 * unresolved facts of both, and the child's purpose unless something is unresolved.
 */
final readonly class ChildCommand
{
    /**
     * @param  list<ClassFact>  $ownFacts
     * @param  list<UnresolvedFact>  $ownUnresolved
     * @param  list<PartClassification>  $children
     */
    public static function join(int $node, ProgramIdentity $wrapper, array $ownFacts, array $ownUnresolved, array $children): PartClassification
    {
        $facts = $ownFacts;
        $unresolved = $ownUnresolved;
        $purpose = CommandType::Ordinary;
        foreach ($children as $child) {
            $facts = [...$facts, ...array_map(fn (ClassFact $fact): ClassFact => new ClassFact($fact->class, $node, $fact->origin, "Its child {$child->program?->family}: {$fact->reason}"), $child->facts)];
            $unresolved = [...$unresolved, ...array_map(fn (UnresolvedFact $fact): UnresolvedFact => new UnresolvedFact($fact->type, $node, $fact->reason), $child->unresolved)];
            $purpose = $purpose === CommandType::Ordinary ? $child->purpose : $purpose;
        }

        return new PartClassification($node, $facts, $unresolved, $unresolved === [] ? $purpose : CommandType::Unknown, $wrapper);
    }
}
