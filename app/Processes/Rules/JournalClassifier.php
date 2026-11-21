<?php

declare(strict_types=1);

namespace App\Processes\Rules;

use App\Files\Attributes\OutsideThePlaces;
use App\Files\Enums\PlaceExemption;
use App\Processes\Contracts\ProgramClassifier;
use App\Processes\Enums\CommandClass;
use App\Processes\Enums\CommandType;
use App\Processes\Enums\UnresolvedType;
use App\Processes\Support\JournalRoutes;
use App\Processes\Values\ClassFact;
use App\Processes\Values\ExecutionContext;
use App\Processes\Values\PartClassification;
use App\Processes\Values\ProgramIdentity;
use App\Processes\Values\RuleOrigin;
use App\Processes\Values\UnresolvedFact;
use App\Processes\Values\Word;

/**
 * Classifies a journal command by the exact route it calls (doc 21 revision 3, section 10): journal <subject> <verb>
 * runs the console command subject:verb, which reads or writes the journal and may need more. Only this installation's
 * journal is trusted; a journal executable found anywhere else is unresolved. Route guards still decide at dispatch.
 */
final readonly class JournalClassifier implements ProgramClassifier
{
    public function __construct(private JournalRoutes $routes, private string $trustedExecutable) {}

    public function classifies(ProgramIdentity $program): bool
    {
        return $program->family === 'journal';
    }

    /**
     * @param  list<Word>  $words
     */
    public function classify(
        array $words,
        int $node,
        ProgramIdentity $program,
        ExecutionContext $context,
    ): PartClassification {
        if (! $this->isTrusted($program, $context)) {
            return $this->unresolved(
                $node,
                $program,
                UnresolvedType::UnresolvedExecutable,
                "{$program->original} is not this installation's journal.",
            );
        }

        $name = implode(
            ':',
            array_map(fn (Word $word): string => (string) $word->literal(), array_slice($words, 1, 2)),
        );
        $route = $this->routes->routeOf($name);

        if ($route === []) {
            return $this->unresolved(
                $node,
                $program,
                UnresolvedType::UnknownSubcommand,
                "journal has no route {$name}; the registered routes are listed by journal --help.",
            );
        }

        $origin = new RuleOrigin("core.journal.{$name}", 1);
        $classes = $route[0]->classes();
        $facts = array_map(
            fn (CommandClass $class) => new ClassFact($class, $node, $origin, "The journal route {$name} does it."),
            $classes,
        );

        return new PartClassification($node, $facts, [], CommandType::Ordinary, $program);
    }

    /**
     * Whether the journal named is this installation's: the bare name, or a written path that is the trusted
     * executable.
     */
    #[OutsideThePlaces(PlaceExemption::CommandFileSystem)]
    private function isTrusted(ProgramIdentity $program, ExecutionContext $context): bool
    {
        if (! str_contains($program->original, '/')) {
            return true;
        }

        $written = str_starts_with($program->original, '/') ? $program->original : rtrim(
            $context->workingFolder,
            '/',
        ).'/'.$program->original;

        return realpath($written) !== false && realpath($written) === realpath($this->trustedExecutable);
    }

    private function unresolved(
        int $node,
        ProgramIdentity $program,
        UnresolvedType $type,
        string $reason,
    ): PartClassification {
        return new PartClassification(
            $node,
            [],
            [new UnresolvedFact($type, $node, $reason)],
            CommandType::Unknown,
            $program,
        );
    }
}
