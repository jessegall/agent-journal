<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\LiteralSentenceAssertionScan;
use Tests\Support\ScanCache\ScanCache;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Rule 67 (user messages 16018, 16024): a test never compares a literal sentence, so rewording a text never breaks a
 * test. It asserts the exception class and its fields, or compares against what the code builds.
 */
#[TimeLimit(seconds: 20, reason: 'It parses every test file it judges, from the scan cache after the first run.')]
final class LiteralSentenceAssertionTest extends TestCase
{
    private const string HOW_TO_FIX = 'Assert the exception class and its fields, or what the code builds (rule 67).';

    public function test_no_test_asserts_a_literal_sentence(): void
    {
        $found = [];

        foreach (ScanCache::findingsInFolders(new LiteralSentenceAssertionScan(), self::foldersWithTests()) as $path => $all) {
            foreach ($all as $assertion) {
                $found[] = str_replace(base_path().'/', '', $path).":{$assertion['line']} '{$assertion['sentence']}'";
            }
        }

        $this->assertSame([], $found, self::HOW_TO_FIX);
    }

    /**
     * The project's tests and every domain's.
     *
     * @return list<string>
     */
    private static function foldersWithTests(): array
    {
        $domainTests = array_map(fn (string $code) => dirname($code).'/tests', DomainFiles::domainCode());

        return array_values(array_filter([base_path('tests'), ...$domainTests], is_dir(...)));
    }
}
