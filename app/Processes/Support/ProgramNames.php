<?php

declare(strict_types=1);

namespace App\Processes\Support;

use App\Processes\Enums\UnresolvedType;
use App\Processes\Values\ProgramIdentity;
use App\Processes\Values\ProgramSpellings;
use App\Processes\Values\UnresolvedFact;
use App\Processes\Values\Word;

/**
 * Turns the executable word of a command into its canonical program (doc 21 revision 3, section 52): the literal text
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
                'The program name is only known when the command runs.',
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
