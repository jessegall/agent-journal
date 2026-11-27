<?php

declare(strict_types=1);

namespace Tests\Unit\Autoload;

use App\Bootstrap\Psr4ClassNames;
use App\Files\Enums\Place;
use App\Support\Codebase;
use App\Support\CodeFiles;
use App\Values\FilePath;
use Illuminate\Console\Command;
use PHPUnit\Framework\TestCase;

/**
 * What a boot reads from the code is read once per process: a second boot takes the same object, not a fresh read
 * of Composer's roots, a folder or Core's exports.
 */
final class ReadOncePerProcessTest extends TestCase
{
    public function test_composer_roots_are_read_once(): void
    {
        $this->assertSame(Psr4ClassNames::fromComposer(), Psr4ClassNames::fromComposer());
    }

    public function test_a_folder_is_read_once_and_answers_the_same_classes(): void
    {
        $folder = dirname(__DIR__, 3).'/app/*/Console';
        $first = Codebase::in($folder, Command::class);

        $this->assertNotSame([], $first);
        $this->assertSame($first, Codebase::in($folder, Command::class));
        $this->assertSame(1, CodeFiles::ofProcess()->readCount(FilePath::in(Place::Project, 'app/*/Console/*.php')));
    }
}
