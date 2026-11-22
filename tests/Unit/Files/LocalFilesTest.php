<?php

declare(strict_types=1);

namespace Tests\Unit\Files;

use App\Enums\Place;
use App\Exceptions\FileJsonInvalid;
use App\Exceptions\FileMissing;
use App\Exceptions\FileReadReentered;
use App\Exceptions\FileUnreadable;
use App\Exceptions\LinkLeavesPlace;
use App\Support\LocalFiles;
use App\Support\Reflector;
use App\Values\FilePath;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Filesystem\Filesystem;
use Tests\TestCase;

/**
 * LocalFiles reads a project file once while it is unchanged, reads a private file fresh every time, refuses a
 * read started inside a read, and names every failure.
 */
final class LocalFilesTest extends TestCase
{
    private const string JSON_BYTES = '{"a": 1}';

    private const string SECOND_BYTES = 'second version';

    private string $folder;

    private LocalFiles $files;

    protected function setUp(): void
    {
        parent::setUp();

        $this->folder = sys_get_temp_dir().'/local-files-'.bin2hex(random_bytes(6));
        mkdir("{$this->folder}/project/docs", 0o700, true);
        mkdir("{$this->folder}/accounts", 0o700, true);
        mkdir("{$this->folder}/outside", 0o700, true);
        config([
            'files.places.project' => "{$this->folder}/project",
            'files.places.temporary' => "{$this->folder}/project",
            'accounts.root' => "{$this->folder}/accounts",
        ]);
        CarbonImmutable::setTestNow(CarbonImmutable::now()->addMinute());
        $this->files = $this->app->make(LocalFiles::class);
    }

    protected function tearDown(): void
    {
        CarbonImmutable::setTestNow();
        chmod($this->folder, 0o700);
        new Filesystem()->deleteDirectory($this->folder);

        parent::tearDown();
    }

    public function test_a_project_file_reads_its_bytes_and_a_second_read_opens_nothing(): void
    {
        $file = $this->write('docs/images.json', self::JSON_BYTES);

        $this->assertSame(self::JSON_BYTES, $this->files->read($file));
        $this->assertSame(self::JSON_BYTES, $this->files->read($file));
        $this->assertSame(1, $this->files->readCount($file));
    }

    public function test_json_is_decoded_once_while_the_file_is_unchanged(): void
    {
        $file = $this->write('docs/images.json', '{"a": [1, 2]}');

        $this->assertSame(['a' => [1, 2]], $this->files->readJson($file));
        $this->assertSame(['a' => [1, 2]], $this->files->readJson($file));
        $this->assertSame(1, $this->files->readCount($file));
    }

    public function test_a_missing_file_is_refused_by_place_and_relative_path(): void
    {
        try {
            $this->files->read($this->path('docs/none.json'));
            $this->fail('A missing file was read.');
        } catch (FileMissing $refusal) {
            $this->assertSame(
                FileMissing::at($this->path('docs/none.json')->label())->getMessage(),
                $refusal->getMessage(),
            );
        }
    }

    public function test_exists_answers_for_files_and_is_folder_for_folders(): void
    {
        $file = $this->write('docs/a.txt', 'a');

        $this->assertTrue($this->files->exists($file));
        $this->assertFalse($this->files->exists($this->path('docs')));
        $this->assertFalse($this->files->exists($this->path('docs/none.txt')));
        $this->assertTrue($this->files->isFolder($this->path('docs')));
        $this->assertFalse($this->files->isFolder($file));
        $this->assertSame(0, $this->files->readCount($file));
    }

    public function test_an_empty_file_reads_as_empty_and_is_kept(): void
    {
        $file = $this->write('docs/empty.txt', '');

        $this->assertSame('', $this->files->read($file));
        $this->assertSame('', $this->files->read($file));
        $this->assertSame(1, $this->files->readCount($file));
    }

    public function test_a_file_past_the_file_limit_is_read_but_not_kept(): void
    {
        $file = $this->write('docs/large.log', str_repeat('x', 1024 * 1024 + 1));

        $this->assertSame(1024 * 1024 + 1, strlen($this->files->read($file)));
        $this->files->read($file);
        $this->assertSame(2, $this->files->readCount($file));
    }

    public function test_a_bounded_read_stops_at_its_limit(): void
    {
        $this->assertSame('abc', $this->files->readAtMost($this->write('docs/draft.txt', 'abcdef'), 3));
    }

    public function test_a_digest_is_hashed_once_while_the_file_is_unchanged(): void
    {
        $file = $this->write('docs/tool', 'binary');

        $this->assertSame(hash('sha256', 'binary'), $this->files->digest($file));
        $this->assertSame(hash('sha256', 'binary'), $this->files->digest($file));
        $this->assertSame(1, $this->files->readCount($file));
    }

    public function test_a_name_with_spaces_quotes_and_accents_reads(): void
    {
        $this->assertSame('odd', $this->files->read($this->write('docs/naïve "quoted" name\'s.md', 'odd')));
    }

    public function test_a_changed_file_is_read_fresh_and_a_deleted_one_is_missing(): void
    {
        $file = $this->write('docs/a.txt', 'first');
        $this->files->read($file);
        $this->write('docs/a.txt', self::SECOND_BYTES);

        $this->assertSame(self::SECOND_BYTES, $this->files->read($file));

        unlink("{$this->folder}/project/docs/a.txt");
        $this->expectException(FileMissing::class);

        $this->files->read($file);
    }

    public function test_two_names_for_one_file_share_one_kept_copy(): void
    {
        $file = $this->write('docs/a.txt', 'shared');
        symlink("{$this->folder}/project/docs/a.txt", "{$this->folder}/project/docs/b.txt");

        $this->files->read($file);
        $this->files->read($this->path('docs/b.txt'));

        $this->assertSame(1, $this->files->readCount($file));
    }

    public function test_a_read_started_inside_a_read_is_refused_naming_both_paths(): void
    {
        $outer = $this->write('docs/outer.json', '{}');
        $inner = $this->write('docs/inner.json', '{}');

        try {
            $this->whileReading($outer, fn () => $this->files->readJson($inner));
            $this->fail('A read inside a read was allowed.');
        } catch (FileReadReentered $refusal) {
            $this->assertEquals(FileReadReentered::inside($outer->label(), $inner->label()), $refusal);
        }
    }

    public function test_the_read_flag_is_released_after_a_failure_and_reads_in_turn_are_allowed(): void
    {
        $file = $this->write('docs/a.txt', 'a');

        $this->assertThrows(fn () => $this->files->read($this->path('docs/none.txt')), FileMissing::class);

        foreach (range(1, 10) as $turn) {
            $this->assertSame('a', $this->files->read($file));
        }
    }

    public function test_a_private_file_is_opened_on_every_read_and_never_kept(): void
    {
        file_put_contents("{$this->folder}/accounts/settings.json", '{"secret": true}');
        $file = FilePath::in(Place::Accounts, 'settings.json');

        $this->files->read($file);
        $this->files->readJson($file);
        $this->files->read($file);

        $this->assertSame(3, $this->files->readCount($file));
    }

    public function test_an_unreadable_file_is_refused_by_name_and_never_read_as_empty(): void
    {
        if (posix_geteuid() === 0) {
            $this->markTestSkipped('The root user reads a file of mode 0000.');
        }

        $file = $this->write('docs/locked.txt', 'locked');
        chmod("{$this->folder}/project/docs/locked.txt", 0o000);

        $this->expectExceptionObject(FileUnreadable::at($file->label()));

        $this->files->read($file);
    }

    public function test_a_folder_read_as_a_file_is_refused(): void
    {
        $this->expectExceptionObject(FileUnreadable::at($this->path('docs')->label()));

        $this->files->read($this->path('docs'));
    }

    public function test_broken_json_is_refused_by_name_and_a_fixed_file_is_read(): void
    {
        $file = $this->write('docs/broken.json', '{"a": ');

        try {
            $this->files->readJson($file);
            $this->fail('Broken JSON was decoded.');
        } catch (FileJsonInvalid $refusal) {
            $this->assertStringContainsString($this->path('docs/broken.json')->label(), $refusal->getMessage());
        }

        $this->write('docs/broken.json', '{"a": 1}');
        $this->assertSame(['a' => 1], $this->files->readJson($file));
    }

    public function test_a_planted_link_to_a_host_file_is_refused_and_the_file_never_read(): void
    {
        file_put_contents("{$this->folder}/outside/id_rsa", 'key');
        symlink("{$this->folder}/outside/id_rsa", "{$this->folder}/project/docs/x.md");

        try {
            $this->files->read($this->path('docs/x.md'));
            $this->fail('A link out of the place was read.');
        } catch (LinkLeavesPlace $refusal) {
            $this->assertStringNotContainsString('outside', $refusal->getMessage());
        }
    }

    private function path(string $relative): FilePath
    {
        return FilePath::in(Place::Project, $relative);
    }

    /**
     * Writes a project file; the test clock runs a minute ahead, so the file counts as settled and is kept.
     */
    private function write(string $relative, string $bytes): FilePath
    {
        file_put_contents("{$this->folder}/project/{$relative}", $bytes);

        return $this->path($relative);
    }

    /**
     * Runs code while LocalFiles holds its read flag for a file, as a listener fired during a read would.
     *
     * @param  Closure(): mixed  $work
     */
    private function whileReading(FilePath $file, Closure $work): mixed
    {
        return Reflector::of(LocalFiles::class)->method('whileReading')->invokeOn($this->files, $file, $work);
    }
}
