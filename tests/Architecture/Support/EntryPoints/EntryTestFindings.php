<?php

declare(strict_types=1);

namespace Tests\Architecture\Support\EntryPoints;

use App\Support\Reflector;

/**
 * What the entries read from the code and the entries the tests name disagree on: a test away from where its entry's
 * tests belong, and an entry no test names.
 */
final readonly class EntryTestFindings
{
    /**
     * @param  list<EntryPoint>  $entries
     * @param  list<NamedEntry>  $named
     * @param  list<string>  $testFiles  every judged test file, by its path from the project root
     */
    public function __construct(private array $entries, private array $named, private array $testFiles) {}

    /**
     * Each test that sits away from the place its entry's tests belong, with the place to move it to.
     *
     * @return list<string>
     */
    public function misplaced(): array
    {
        $misplaced = [];

        foreach ($this->named as $named) {
            foreach (array_filter($this->entries, $named->isFor(...)) as $entry) {
                if (! $entry->isTestPlace($named->file)) {
                    $misplaced[] = "{$named->file} tests the {$named->type->value} {$named->name}: move it to "
                        ."{$entry->testPlace}.";
                }
            }
        }

        return $misplaced;
    }

    /**
     * Each entry no test names, with what to write: the test file of a command, state or middleware, or the attribute
     * its test at the right path lacks; the generator's line for a route method or MCP tool; the attribute and folder
     * of a hook moment or read.
     *
     * @return list<string>
     */
    public function untested(): array
    {
        $untested = array_filter($this->entries, fn (EntryPoint $entry) => ! $this->isNamed($entry));

        return array_values(array_map($this->gapOf(...), $untested));
    }

    /**
     * Each entry more than one test class names, with every file that names it; a class naming several methods of one
     * route or several moments counts once.
     *
     * @return list<string>
     */
    public function doubles(): array
    {
        $files = [];

        foreach ($this->named as $named) {
            if ($named->type->hasOneTestClass()) {
                $files["The {$named->type->value} {$named->name}"][$named->testClass] = $named->file;
            }
        }

        $doubles = array_filter($files, fn (array $byClass) => count($byClass) > 1);

        return array_values(array_map(
            fn (string $entry, array $byClass) => "{$entry} is named by more than one test class, in "
                .implode(', ', $byClass).': keep one.',
            array_keys($doubles),
            $doubles,
        ));
    }

    private function gapOf(EntryPoint $entry): string
    {
        $type = $entry->type->value;
        $attribute = Reflector::of($entry->type->attribute())->shortName();

        return match ($entry->type) {
            EntryType::Command, EntryType::State, EntryType::Middleware => in_array(
                $entry->testPlace,
                $this->testFiles,
                true,
            )
                ? "{$entry->testPlace} tests the {$type} {$entry->name} without #[{$attribute}]: add it."
                : "The {$type} {$entry->name} has no test: write it at {$entry->testPlace} with #[{$attribute}].",
            EntryType::Route, EntryType::McpTool => "The {$type} {$entry->name} has no test: write it with "
                .'php tests/bin/entry-tests.php --write.',
            EntryType::Hook => "The {$type} {$entry->name} has no test: name it with #[{$attribute}] in a test under "
                ."{$entry->testPlace}.",
            EntryType::Read => "The read {$entry->name} has no test: write one with #[{$attribute}] at "
                ."{$entry->testPlace}/".Reflector::of($entry->name)->shortName().'Test.php.',
        };
    }

    private function isNamed(EntryPoint $entry): bool
    {
        return array_filter($this->named, fn (NamedEntry $named) => $named->isFor($entry)) !== [];
    }
}
