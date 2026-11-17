<?php

declare(strict_types=1);

namespace App\Domain\Processes;

use App\Core\Hooks\Contracts\ShellCommandParser;
use App\Core\Hooks\Inputs\CommandEffect;
use App\Core\Hooks\Inputs\CommandKind;
use App\Core\Hooks\Inputs\CommandPart;
use App\Core\Hooks\Inputs\ParseOutcome;
use App\Core\Hooks\Inputs\ShellCommand;
use App\Core\Hooks\Inputs\ShellDialect;

/**
 * Reads a shell line into its commands and the facts the role bottoms judge: what each command is and whether it
 * may change files. It reads only the line itself, so no flag a program sends can make a command look saved or safe.
 */
final readonly class HookCommandFacts implements ShellCommandParser
{
    public function __construct(private CommandCatalog $catalog) {}

    public function parse(string $line, ShellDialect $dialect): ShellCommand
    {
        $words = ShellWords::of($line);

        if (! $words->isComplete()) {
            return new ShellCommand($line, $dialect, ParseOutcome::Unparsed, []);
        }

        $parts = array_map(fn (ShellSegment $segment) => $this->partFor($segment), $words->segments());
        $outcome = $words->hasExpansion() ? ParseOutcome::DynamicExpansion : ParseOutcome::Complete;

        return new ShellCommand($line, $dialect, $outcome, $parts);
    }

    private function partFor(ShellSegment $segment): CommandPart
    {
        $words = $segment->commandWords();

        if ($words === [] || $segment->programIsDynamic()) {
            return new CommandPart('', [], CommandEffect::Unknown, CommandKind::Unknown, $segment->join);
        }

        $effect = $segment->hasWritingRedirect() ? CommandEffect::ChangesFiles : $this->catalog->effectOf($words);

        return new CommandPart($words[0], array_slice($words, 1), $effect, $this->catalog->kindOf($words), $segment->join);
    }
}
