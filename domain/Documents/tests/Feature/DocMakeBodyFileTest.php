<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Feature;

use App\Contracts\Files\Files;
use App\Exceptions\FileMissing;
use Domain\Documents\Console\Concerns\ReadsRecordBody;
use Domain\Documents\Tests\TestCase;
use Illuminate\Console\Command;
use Illuminate\Contracts\Console\Kernel;

/**
 * A document's text named by --file is read on the agent's side; a file that is not there fails with that reason, not
 * with the note about giving exactly one of --body or --file.
 */
final class DocMakeBodyFileTest extends TestCase
{
    public function test_a_missing_body_file_fails_with_its_own_reason(): void
    {
        $this->app->make(Kernel::class)->registerCommand(new class extends Command
        {
            use ReadsRecordBody;

            protected $signature = 'test:record-body {--body=} {--file=}';

            public function handle(Files $files): int
            {
                $this->bodyText($files);

                return self::SUCCESS;
            }
        });

        $this->expectException(FileMissing::class);

        $this->artisan('test:record-body', ['--file' => sys_get_temp_dir().'/no-such-notes.md'])->run();
    }
}
