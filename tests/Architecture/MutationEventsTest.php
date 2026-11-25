<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\SilentMutationScan;
use Tests\Support\ScanCache\ScanCache;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * Every method of a model's Mutations section that writes the model's row raises a named event of its own, even when
 * nothing listens to it yet; a model on the list in SilentModels.php is written by the framework outside any unit.
 */
#[TimeLimit(seconds: 60, reason: 'It parses every model of app and the domains.')]
final class MutationEventsTest extends TestCase
{
    private const string FIXTURE = 'tests/Fixtures/MutationEvents/FixtureNote.php';

    private const string SILENT_MODELS = 'tests/Architecture/SilentModels.php';

    private const string MODELS_FOLDER = '/Models/';

    private const string HOW_TO_FIX = "Raise a named event of the model's subject group from each of these mutations:\n";

    private const string LIST_TO_SHRINK = 'These models raise an event from every mutation now; take them off '
        .self::SILENT_MODELS.":\n";

    public function test_every_model_mutation_raises_its_own_event(): void
    {
        $silentModels = $this->silentModels();
        $silent = array_values(array_filter(
            $this->silentMutationsIn($this->modelFiles()),
            fn (string $mutation) => ! in_array(strstr($mutation, '::', true), $silentModels, true),
        ));

        $this->assertSame([], $silent, self::HOW_TO_FIX.implode("\n", $silent));
    }

    public function test_a_model_on_the_list_still_has_a_silent_mutation(): void
    {
        $stillSilent = array_map(
            fn (string $mutation) => strstr($mutation, '::', true),
            $this->silentMutationsIn($this->modelFiles()),
        );
        $converted = array_values(array_diff($this->silentModels(), $stillSilent));

        $this->assertSame([], $converted, self::LIST_TO_SHRINK.implode("\n", $converted));
    }

    public function test_a_mutation_that_raises_nothing_is_found(): void
    {
        $this->assertSame(['FixtureNote::rename'], $this->silentMutationsIn([base_path(self::FIXTURE)]));
    }

    /**
     * @return list<string>
     */
    private function modelFiles(): array
    {
        return array_values(array_filter(
            DomainFiles::in([app_path(), ...DomainFiles::domainCode()]),
            fn (string $path) => str_contains($path, self::MODELS_FOLDER),
        ));
    }

    /**
     * @param  list<string>  $files
     * @return list<string> each silent mutation as Model::method
     */
    private function silentMutationsIn(array $files): array
    {
        return ScanCache::findings(new SilentMutationScan(), $files);
    }

    /**
     * @return list<string>
     */
    private function silentModels(): array
    {
        /** @var array<string, string> $reasons */
        $reasons = require base_path(self::SILENT_MODELS);

        return array_keys($reasons);
    }
}
