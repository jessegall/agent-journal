<?php

declare(strict_types=1);

namespace Tests\Architecture\Support\EntryPoints;

use App\Support\Reflector;

/**
 * What the entries read from the code and the entries the tests name disagree on: a test away from where its entry's
 * tests belong, and a read no test names.
 */
final readonly class EntryTestFindings
{
    /**
     * @param  list<EntryPoint>  $entries
     * @param  list<NamedEntry>  $named
     */
    public function __construct(private array $entries, private array $named) {}

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
     * Each read no test names, with the path to write its test at.
     *
     * @return list<string>
     */
    public function untestedReads(): array
    {
        $untested = array_filter(
            $this->entries,
            fn (EntryPoint $entry) => $entry->type === EntryType::Read && ! $this->isNamed($entry),
        );

        return array_values(array_map(
            fn (EntryPoint $entry) => "The read {$entry->name} has no test: write one with #[TestsRead] at "
                ."{$entry->testPlace}/".Reflector::of($entry->name)->shortName().'Test.php.',
            $untested,
        ));
    }

    private function isNamed(EntryPoint $entry): bool
    {
        return array_filter($this->named, fn (NamedEntry $named) => $named->isFor($entry)) !== [];
    }
}
