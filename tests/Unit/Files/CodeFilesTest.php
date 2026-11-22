<?php

declare(strict_types=1);

namespace Tests\Unit\Files;

use App\Files\Enums\Place;
use App\Files\Exceptions\CodeReadOutsideProject;
use App\Files\Support\CodeFiles;
use App\Files\Values\FilePath;
use Illuminate\Filesystem\Filesystem;
use PHPUnit\Framework\TestCase;

/**
 * The project's code is read from the disk once per process: a second ask takes the same object with no new read, so
 * a file added after the first listing is not seen until the process restarts.
 */
final class CodeFilesTest extends TestCase
{
    private const string CLOSE_SOURCE = '<?php // close';

    private string $folder;

    protected function setUp(): void
    {
        parent::setUp();

        $this->folder = sys_get_temp_dir().'/code-files-'.bin2hex(random_bytes(6));
        mkdir("{$this->folder}/app/Tasks/Console", 0o700, true);
        file_put_contents("{$this->folder}/app/Tasks/Console/Close.php", '<?php // close');
    }

    protected function tearDown(): void
    {
        new Filesystem()->deleteDirectory($this->folder);

        parent::tearDown();
    }

    public function test_a_folder_is_listed_once_and_the_same_listing_given_again(): void
    {
        $code = CodeFiles::over($this->folder);
        $pattern = FilePath::in(Place::Project, 'app/*/Console/*.php');

        $first = $code->folder($pattern);
        file_put_contents("{$this->folder}/app/Tasks/Console/Open.php", '<?php // open');
        $second = $code->folder($pattern);

        $this->assertSame($first, $second);
        $this->assertEquals([FilePath::in(Place::Project, 'app/Tasks/Console/Close.php')], $second->paths());
        $this->assertSame(1, $code->readCount($pattern));
    }

    public function test_a_code_file_is_read_once(): void
    {
        $code = CodeFiles::over($this->folder);
        $file = FilePath::in(Place::Project, 'app/Tasks/Console/Close.php');

        $this->assertSame(self::CLOSE_SOURCE, $code->file($file));
        file_put_contents("{$this->folder}/app/Tasks/Console/Close.php", '<?php // changed');

        $this->assertSame(self::CLOSE_SOURCE, $code->file($file));
        $this->assertSame(1, $code->readCount($file));
    }

    public function test_the_process_keeps_one_set_of_code_reads(): void
    {
        $this->assertSame(CodeFiles::ofProcess(), CodeFiles::ofProcess());
    }

    public function test_a_code_read_of_another_place_is_refused(): void
    {
        $this->expectExceptionObject(CodeReadOutsideProject::for(Place::Accounts));

        CodeFiles::over($this->folder)->folder(FilePath::in(Place::Accounts, '*'));
    }
}
