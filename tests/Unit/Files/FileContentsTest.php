<?php

declare(strict_types=1);

namespace Tests\Unit\Files;

use App\Files\Enums\Place;
use App\Files\FileContents;
use App\Files\Values\Fingerprint;
use App\Values\FilePath;
use Carbon\CarbonImmutable;
use Illuminate\Filesystem\Filesystem;
use JsonException;
use Tests\TestCase;

/**
 * An unchanged settled file is read once and kept; a changed, replaced or freshly written file is read again, and the
 * kept bytes stay under their limits, least recently read dropped first.
 */
final class FileContentsTest extends TestCase
{
    private const string LONGER_BYTES = 'second, longer';

    private string $folder;

    private int $loads = 0;

    protected function setUp(): void
    {
        parent::setUp();

        $this->folder = sys_get_temp_dir().'/file-contents-'.bin2hex(random_bytes(6));
        mkdir($this->folder);
        CarbonImmutable::setTestNow(CarbonImmutable::now()->addMinute());
    }

    protected function tearDown(): void
    {
        CarbonImmutable::setTestNow();
        new Filesystem()->deleteDirectory($this->folder);

        parent::tearDown();
    }

    public function test_the_same_fingerprint_gives_the_kept_bytes_without_loading_again(): void
    {
        $contents = new FileContents(100, 50);
        $this->write('a.txt', 'first');

        $this->assertSame('first', $this->read($contents, 'a.txt'));
        $this->assertSame('first', $this->read($contents, 'a.txt'));
        $this->assertSame(1, $this->loads);
        $this->assertSame(1, $contents->openCount($this->real('a.txt')));
    }

    public function test_a_rewritten_file_is_loaded_again(): void
    {
        $contents = new FileContents(100, 50);
        $this->write('a.txt', 'first');
        $this->read($contents, 'a.txt');
        $this->write('a.txt', self::LONGER_BYTES);

        $this->assertSame(self::LONGER_BYTES, $this->read($contents, 'a.txt'));
        $this->assertSame(2, $contents->openCount($this->real('a.txt')));
    }

    public function test_a_file_replaced_by_rename_at_the_same_size_and_time_is_loaded_again(): void
    {
        $contents = new FileContents(100, 50);
        $this->write('a.txt', 'first');
        $this->read($contents, 'a.txt');
        $this->write('b.txt', 'other');
        rename("{$this->folder}/b.txt", "{$this->folder}/a.txt");

        $this->assertSame('other', $this->read($contents, 'a.txt'));
        $this->assertSame(2, $this->loads);
    }

    public function test_a_file_changed_within_the_last_second_is_never_kept(): void
    {
        $contents = new FileContents(100, 50);
        $this->write('a.txt', 'first', CarbonImmutable::now()->getTimestamp());

        $this->read($contents, 'a.txt');
        $this->read($contents, 'a.txt');

        $this->assertSame(2, $this->loads);
    }

    public function test_the_byte_limit_drops_the_least_recently_read_first(): void
    {
        $contents = new FileContents(10, 8);
        $this->write('a.txt', 'aaaa');
        $this->write('b.txt', 'bbbb');
        $this->write('c.txt', 'cccc');

        $this->read($contents, 'a.txt');
        $this->read($contents, 'b.txt');
        $this->read($contents, 'a.txt');
        $this->read($contents, 'c.txt');

        $this->assertSame(1, $contents->openCount($this->real('a.txt')));
        $this->read($contents, 'a.txt');
        $this->read($contents, 'b.txt');
        $this->assertSame(1, $contents->openCount($this->real('a.txt')));
        $this->assertSame(2, $contents->openCount($this->real('b.txt')));
    }

    public function test_a_file_past_the_configured_file_limit_is_returned_but_never_kept(): void
    {
        $contents = $this->app->make(FileContents::class);
        $this->write('large.bin', str_repeat('x', 2 * 1024 * 1024));

        $this->assertSame(2 * 1024 * 1024, strlen($this->read($contents, 'large.bin')));
        $this->read($contents, 'large.bin');
        $this->assertSame(2, $contents->openCount($this->real('large.bin')));
    }

    public function test_two_paths_to_one_real_file_share_one_kept_copy(): void
    {
        $contents = new FileContents(100, 50);
        $this->write('a.txt', 'first');
        symlink("{$this->folder}/a.txt", "{$this->folder}/link.txt");

        $this->read($contents, 'a.txt');
        $this->read($contents, 'link.txt');

        $this->assertSame(1, $this->loads);
    }

    public function test_decoded_json_is_kept_and_a_parse_failure_keeps_nothing(): void
    {
        $contents = new FileContents(100, 50);
        $this->write('good.json', '{"a": 1}');
        $this->write('bad.json', '{"a": ');

        $this->assertSame(['a' => 1], $this->decode($contents, 'good.json'));
        $this->assertSame(['a' => 1], $this->decode($contents, 'good.json'));
        $this->assertSame(1, $this->loads);

        foreach ([1, 2] as $attempt) {
            try {
                $this->decode($contents, 'bad.json');
                $this->fail('Broken JSON was decoded.');
            } catch (JsonException) {
                $this->assertSame($attempt, $contents->openCount($this->real('bad.json')));
            }
        }
    }

    public function test_a_dropped_file_is_loaded_again(): void
    {
        $contents = new FileContents(100, 50);
        $this->write('a.txt', 'first');
        $this->read($contents, 'a.txt');
        $contents->drop($this->real('a.txt'));
        $this->read($contents, 'a.txt');

        $this->assertSame(2, $this->loads);
    }

    public function test_a_read_of_a_kept_file_keeps_its_digest(): void
    {
        $contents = new FileContents(100, 50);
        $this->write('a.txt', 'first');
        $hashes = 0;
        $hasher = function () use (&$hashes) {
            $hashes++;

            return hash('sha256', 'first');
        };

        $contents->digest($this->fingerprint('a.txt'), $hasher);
        $this->read($contents, 'a.txt');
        $this->read($contents, 'a.txt');
        $contents->digest($this->fingerprint('a.txt'), $hasher);

        $this->assertSame(1, $hashes);
    }

    private function write(string $name, string $bytes, int|null $modifiedAt = null): void
    {
        file_put_contents("{$this->folder}/{$name}", $bytes);
        touch("{$this->folder}/{$name}", $modifiedAt ?? 1_000_000);
    }

    private function real(string $name): string
    {
        return (string) realpath("{$this->folder}/{$name}");
    }

    private function fingerprint(string $name): Fingerprint
    {
        return Fingerprint::of(FilePath::in(Place::Temporary, $name), $this->real($name));
    }

    private function read(FileContents $contents, string $name): string
    {
        return $contents->kept($this->fingerprint($name), function () use ($name) {
            $this->loads++;

            return (string) file_get_contents($this->real($name));
        });
    }

    /**
     * @return array<array-key, mixed>
     */
    private function decode(FileContents $contents, string $name): array
    {
        return $contents->decoded(
            $this->fingerprint($name),
            fn (string $bytes) => (array) json_decode($bytes, true, 64, JSON_THROW_ON_ERROR),
            function () use ($name) {
                $this->loads++;

                return (string) file_get_contents($this->real($name));
            },
        );
    }
}
