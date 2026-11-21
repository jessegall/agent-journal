<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\ModelWrite;
use Tests\Architecture\Support\ModelWrites;
use Tests\Architecture\Support\ModelWriteScan;
use Tests\Architecture\Support\ParsedFile;
use Tests\Support\JudgesFixtureFiles;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A model method writes only its own row (plan 40): every write of a model, its traits and helpers outside that row
 * is either on the frozen list of its area, tests/Architecture/Legacy/ModelWrites, or the test fails; a listed method
 * that writes only its own row fails it too, so the lists only shrink.
 */
#[TimeLimit(seconds: 30, reason: 'It parses every model file of app and the domains.')]
final class ModelOwnRowTest extends TestCase
{
    use JudgesFixtureFiles;

    private const string FIXTURES = 'tests/Fixtures/ModelWrites';

    /**
     * @return iterable<string, array{string, list<string>}>
     */
    public static function fixtures(): iterable
    {
        yield 'own row, alias, constructor insert and own helpers' => ['Models/OwnRowWriter.php', []];

        yield 'every foreign form' => ['Models/ForeignWriter.php', [
            '29 ForeignWriter::renameOldest writes another row of its class: $oldest->save()',
            '34 ForeignWriter::closeChildren writes through a relation: '
                .'$this->children()->update([\'closed\' => true])',
            '42 ForeignWriter::tag writes through a relation: $this->tags()->attach($ids)',
            '47 ForeignWriter::forgetClosed writes rows by query: self::query()->where(\'closed\', true)->delete()',
            '52 ForeignWriter::logDirectly writes the database directly: '
                .'\Illuminate\Support\Facades\DB::table(\'logs\')',
            '57 ForeignWriter::addChild writes a row of OwnRowWriter: '
                .'\Tests\Fixtures\ModelWrites\Models\OwnRowWriter::create(\'child\')',
            '62 ForeignWriter::announce takes a writing service from the container: '
                .'\Illuminate\Container\Container::getInstance()->make(\Illuminate\Contracts\Events\Dispatcher::class)',
            '67 ForeignWriter::announceByHelper dispatches: '
                .'event(new \Tests\Fixtures\ModelWrites\Models\ForeignWriterChanged())',
            '72 ForeignWriter::callByName calls a method by a dynamic name: $this->{$method}()',
            '98 ForeignWriter::runExport starts a process: new \Symfony\Component\Process\Process([\'true\'])',
        ]];

        yield 'a trait body' => ['Models/Concerns/PrunesEveryRow.php', [
            '14 PrunesEveryRow::pruneEveryRow writes rows by query: self::query()->delete()',
        ]];

        yield 'the shape of SignInAttempt::finish' => ['Models/Accounts/SignInAttempt.php', [
            '23 SignInAttempt::finish calls Account::endSignInAgain, which writes: '
                .'\Tests\Fixtures\ModelWrites\Models\Accounts\Account::lockedForJournal($this->account_id)'
                .'->endSignInAgain($this)',
        ]];
    }

    public function test_every_model_writes_only_its_own_row_or_waits_on_its_frozen_list(): void
    {
        $found = ModelWrites::across(base_path());

        $this->assertSame(
            $found->frozenMethods(),
            $found->methods(),
            "A model method writes only its own row; raise a fact for the rest:\n".$found->report(),
        );
    }

    public function test_an_event_recording_model_may_not_write_where_the_capture_cannot_see(): void
    {
        $file = ParsedFile::fromPath(base_path(self::FIXTURES.'/Recording/RecordingWriter.php'));
        $writes = [];

        foreach (ModelWriteScan::of($file)[0]['methods'] as $method) {
            foreach ($method['writes'] as $write) {
                $writes[] = "{$write['line']} {$method['name']} {$write['form']}";
            }
        }

        $this->assertSame([
            '27 renameQuietly writes quietly, where the capture cannot see it',
            '32 countVisit writes quietly, where the capture cannot see it',
            '37 insertOnce inserts rows by query',
        ], $writes);
    }

    /**
     * @return list<string>
     */
    private function violationLines(string $fixture): array
    {
        $found = ModelWrites::in(base_path(), [base_path(self::FIXTURES.'/Models')])->writes();
        $inFixture = array_filter($found, fn (ModelWrite $write) => $write->path === self::FIXTURES."/{$fixture}");

        return array_values(array_map(
            fn (ModelWrite $write) => "{$write->line} {$write->key()} {$write->form}: {$write->evidence}",
            $inFixture,
        ));
    }
}
