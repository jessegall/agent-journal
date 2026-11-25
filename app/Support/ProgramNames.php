<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\CommandRules\UnresolvedType;
use App\Values\AgentText;
use App\Values\ProgramIdentity;
use App\Values\ProgramSpellings;
use App\Values\UnresolvedFact;
use App\Values\Word;

/**
 * Turns the executable word of a command into its canonical program: the literal text
 * loses every directory component, then a declared spelling maps to its family. Operands are never touched, and a word
 * whose text is only known at run time is unresolved, never an empty name.
 */
final readonly class ProgramNames
{
    /**
     * @param  list<ProgramSpellings>  $spellings
     */
    public function canonical(Word $word, int $node, array $spellings): ProgramIdentity|UnresolvedFact
    {
        $original = $word->literal();

        if ($original === null || $original === '') {
            return new UnresolvedFact(
                UnresolvedType::UnresolvedExecutable,
                $node,
                AgentText::of('core.shell.program_dynamic'),
            );
        }

        $name = basename($original);

        foreach ($spellings as $family) {
            if ($family->names($name)) {
                return new ProgramIdentity($family->family, $original);
            }
        }

        return new ProgramIdentity($name, $original);
    }

    /**
     * The families an undeclared name looks like a spelling of, to suggest in a proposal.
     *
     * @param  list<ProgramSpellings>  $spellings
     * @return list<string>
     */
    public function proposalHints(ProgramIdentity $program, array $spellings): array
    {
        $matchingFamilies = array_filter(
            $spellings,
            fn (ProgramSpellings $family): bool => $family->resembles($program->family),
        );

        return array_values(array_map(fn (ProgramSpellings $family): string => $family->family, $matchingFamilies));
    }
}
