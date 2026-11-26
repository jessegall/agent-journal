<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use App\Bus\Contracts\CommandHandler;
use App\Mcp\Tools\JournalTool;
use App\Stacks\AgentState;
use App\Support\Command;
use App\Support\Reflector;
use PHPUnit\Framework\TestCase;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\ScanCache\ScanCache;

/**
 * The machinery tests of a project and what each names: a machinery test names the engine classes it proves, and an
 * entry (a command, handler, controller, state or MCP tool) never, as its proofs belong in that entry's test.
 */
final readonly class MachineryTests
{
    /**
     * The entry kinds a machinery test may not name, by the class or interface each extends.
     */
    private const array ENTRY_KINDS = [
        Command::class => 'command',
        CommandHandler::class => 'command handler',
        AgentState::class => 'state',
        JournalTool::class => 'MCP tool',
    ];

    private const string CONTROLLER = '#\\\\Http\\\\Controllers\\\\#';

    public function __construct(private string $root) {}

    /**
     * @return list<string>
     */
    public function faults(): array
    {
        $folders = [
            ...glob("{$this->root}/tests/Machinery", GLOB_ONLYDIR) ?: [],
            ...glob("{$this->root}/domain/*/tests/Machinery", GLOB_ONLYDIR) ?: [],
        ];
        $faults = [];

        foreach (ScanCache::findingsInFolders(new ClassesDeclared(), $folders) as $path => $classes) {
            $file = substr($path, strlen($this->root) + 1);

            foreach ($classes as $class) {
                $faults = [...$faults, ...$this->faultsOf($file, $class)];
            }
        }

        return $faults;
    }

    /**
     * @return list<string>
     */
    private function faultsOf(string $file, string $class): array
    {
        if (! $this->isTest($class)) {
            return [];
        }

        $subjects = array_map(
            fn ($attribute) => $attribute->instance()->subject,
            Reflector::of($class)->attributes(TestsMachinery::class)->entries(),
        );

        if ($subjects === []) {
            return ["{$file} names no engine class: add #[TestsMachinery(...)] with the class it proves."];
        }

        return array_merge(...array_map(fn (string $subject) => $this->faultsOfSubject($file, $subject), $subjects));
    }

    /**
     * @phpstan-assert-if-true class-string $class
     */
    private function isTest(string $class): bool
    {
        return Reflector::exists($class)
            && ! Reflector::of($class)->isAbstract()
            && Reflector::of($class)->isSubclassOf(TestCase::class);
    }

    /**
     * @return list<string>
     */
    private function faultsOfSubject(string $file, string $subject): array
    {
        if (! Reflector::exists($subject)) {
            return ["{$file} names {$subject}, which does not exist: name the engine class it proves."];
        }

        if (preg_match(self::CONTROLLER, $subject) === 1) {
            return ["{$file} names {$subject}, a controller: its proofs belong in that route's test."];
        }

        $kinds = array_filter(
            self::ENTRY_KINDS,
            fn (string $kind, string $base) => $subject === $base || Reflector::of($subject)->isSubclassOf($base),
            ARRAY_FILTER_USE_BOTH,
        );

        return array_values(array_map(
            fn (string $kind) => "{$file} names {$subject}, a {$kind}: its proofs belong in that entry's test.",
            $kinds,
        ));
    }
}
