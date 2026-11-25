<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Unit;

use PHPUnit\Framework\TestCase;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use SplFileInfo;

/**
 * Tasks works with Plans absent: no Tasks file imports Plans; Plans' listeners are named on Tasks' facts as text only.
 */
final class TasksStandAloneTest extends TestCase
{
    public function test_no_tasks_file_imports_plans(): void
    {
        $importing = [];
        $files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator(dirname(__DIR__, 2)));

        foreach ($files as $file) {
            if (! $file instanceof SplFileInfo || ! in_array($file->getExtension(), [
                'php',
                'ts',
                'vue',
            ], true)) {
                continue;
            }

            $text = (string) file_get_contents($file->getPathname());

            if (preg_match('/^use Domain\\\\Plans\\\\|from \'@domain\/plans|types\/plans\'/m', $text) === 1) {
                $importing[] = $file->getPathname();
            }
        }

        $this->assertSame([], $importing);
    }
}
